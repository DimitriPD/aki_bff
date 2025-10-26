import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import logger from '../logger';

export interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown[];
  trace_id: string;
  timestamp: string;
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const traceId = req.headers['x-correlation-id'] as string || req.id || 'unknown';

  // Log the error
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    traceId,
    path: req.path,
    method: req.method,
  });

  // Handle AppError instances
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      code: error.code,
      message: error.message,
      details: error.details,
      trace_id: error.traceId || traceId,
      timestamp: new Date().toISOString(),
    };

    res.status(error.statusCode).json(response);
    return;
  }

  // Handle unexpected errors
  const response: ErrorResponse = {
    code: 'internal_error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message,
    trace_id: traceId,
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(response);
};
