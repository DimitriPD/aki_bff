import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from './LoginUseCase';

const useCase = new LoginUseCase();

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const result = await useCase.execute(req.body, correlationId);
    res.status(200).json({ data: result, message: 'Login successful' });
  } catch (err) {
    next(err);
  }
}
