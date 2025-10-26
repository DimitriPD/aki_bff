import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';

export const generateCorrelationId = (): string => {
  return uuidv4();
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const parseBoolean = (value: string | undefined, defaultValue = false): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

export const sanitizeObject = (obj: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Standardized API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Send standardized success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string,
  meta?: Record<string, unknown>,
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};

/**
 * Send standardized created response
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message?: string,
): void => {
  sendSuccess(res, data, 201, message);
};

/**
 * Send no content response
 */
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};
