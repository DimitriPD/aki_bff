import { Request, Response, NextFunction } from 'express';
import { ForgotPasswordUseCase } from './ForgotPasswordUseCase';

const useCase = new ForgotPasswordUseCase();

export async function forgotPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const result = await useCase.execute(req.body, correlationId);
    res.status(200).json({ data: result, message: 'Password recovery email sent' });
  } catch (err) {
    next(err);
  }
}
