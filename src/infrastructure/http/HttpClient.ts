import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import logger from '../../shared/logger';
import { AppError, InternalServerError, ServiceUnavailableError } from '../../shared/errors';
import { delay } from '../../shared/utils';

export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class HttpClient {
  private client: AxiosInstance;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: HttpClientConfig) {
    this.maxRetries = config.maxRetries || 2;
    this.retryDelay = config.retryDelay || 1000;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const correlationId = config.headers['x-correlation-id'] as string || this.generateCorrelationId();
        config.headers['x-correlation-id'] = correlationId;

        logger.debug('HTTP Request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          correlationId,
        });

        return config;
      },
      (error) => {
        logger.error('HTTP Request Error', { error: error.message });
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('HTTP Response', {
          status: response.status,
          url: response.config.url,
          correlationId: response.config.headers['x-correlation-id'],
        });
        return response;
      },
      async (error: AxiosError) => {
        return this.handleError(error);
      },
    );
  }

  private async handleError(error: AxiosError): Promise<never> {
    const correlationId = error.config?.headers?.['x-correlation-id'] as string;

    logger.error('HTTP Response Error', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      correlationId,
      responseData: error.response?.data,
    });

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response?.data as any;

      // Extract error from nested structure (e.g., Core returns {error: {code, message, details}})
      const errorData = data?.error || data;
      
      throw new AppError(
        status,
        errorData?.code || 'upstream_error',
        errorData?.message || error.message,
        errorData?.details,
        correlationId,
      );
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      // Timeout error
      throw new ServiceUnavailableError(
        'Service request timeout',
        [{ service: error.config?.baseURL }],
        correlationId,
      );
    } else if (error.code === 'ECONNREFUSED') {
      // Connection refused
      throw new ServiceUnavailableError(
        'Service unavailable',
        [{ service: error.config?.baseURL }],
        correlationId,
      );
    }

    // Generic error
    throw new InternalServerError(
      'Unexpected error during HTTP request',
      [{ error: error.message }],
      correlationId,
    );
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries = this.maxRetries,
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        logger.warn(`Retrying request (${retries} attempts left)`);
        await delay(this.retryDelay);
        return this.retryRequest(requestFn, retries - 1);
      }
      throw error;
    }
  }

  private shouldRetry(error: unknown): boolean {
    if (error instanceof AppError) {
      // Only retry on 5xx errors and service unavailability
      // DO NOT retry 4xx errors (client errors like 400, 404, 409)
      return error.statusCode >= 500 || error.code === 'service_unavailable';
    }
    return false;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(async () => {
      const response = await this.client.get<T>(url, config);
      return response.data;
    });
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(async () => {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    });
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(async () => {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(async () => {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    });
  }
}
