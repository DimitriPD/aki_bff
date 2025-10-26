import { HttpClient } from '../HttpClient';
import { config } from '../../config';
import { IFunctionPasswordClient } from '../../../domain/interfaces';

export class FunctionPasswordClient implements IFunctionPasswordClient {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient({
      baseURL: config.services.functionPassword.baseUrl,
      timeout: config.services.functionPassword.timeout,
      maxRetries: config.http.maxRetries,
      retryDelay: config.http.retryDelay,
    });
  }

  async sendForgotPasswordEmail(email: string): Promise<{ status: string }> {
    return this.http.post<{ status: string }>('/api/email/password-recovery', {
      teacher_email: email,
      emailType: 'recovery',
    });
  }

  async validateResetToken(token: string): Promise<{ valid: boolean; teacher_email?: string }> {
    // This might need to be implemented in the Azure Function
    // For now, returning a mock implementation
    return this.http.post<{ valid: boolean; teacher_email?: string }>(
      '/api/email/validate-token',
      {
        token,
      },
    );
  }
}
