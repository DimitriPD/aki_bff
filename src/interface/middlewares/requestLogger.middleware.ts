import { Request, Response, NextFunction } from 'express';
import logger from '../../shared/logger';

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    correlationId: req.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response when finished
  _res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: _res.statusCode,
      duration: `${duration}ms`,
      correlationId: req.id,
    });
  });

  next();
};
