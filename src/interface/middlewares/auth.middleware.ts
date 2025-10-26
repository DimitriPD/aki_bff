import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../infrastructure/config';
import { UnauthorizedError } from '../../shared/errors';
import logger from '../../shared/logger';

export interface JwtPayload {
  teacherId: number;
  email: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      teacher?: {
        id: number;
        email: string;
      };
      id?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const correlationId = req.headers['x-correlation-id'] as string || req.id;

    // Mock authentication for development
    if (config.mock.authEnabled) {
      logger.debug('Using mock authentication', { correlationId });
      req.teacher = {
        id: config.mock.teacherId,
        email: 'mock@teacher.com',
      };
      next();
      return;
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided', undefined, correlationId);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      req.teacher = {
        id: decoded.teacherId,
        email: decoded.email,
      };

      logger.debug('Authentication successful', {
        teacherId: decoded.teacherId,
        correlationId,
      });

      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expired', undefined, correlationId);
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid token', undefined, correlationId);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      await authMiddleware(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
