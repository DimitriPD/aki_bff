import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../shared/errors';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = {
        ...req.body,
        ...req.query,
        ...req.params,
      };

      schema.parse(data);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        next(
          new BadRequestError(
            'Validation failed',
            details,
            req.headers['x-correlation-id'] as string,
          ),
        );
      } else {
        next(error);
      }
    }
  };
};
