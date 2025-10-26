import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const correlationIdMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  req.headers['x-correlation-id'] = correlationId;
  req.id = correlationId;
  next();
};
