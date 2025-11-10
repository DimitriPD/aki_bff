import { Request, Response, NextFunction } from 'express';
import { GetDashboardUseCase } from './GetDashboardUseCase';

const useCase = new GetDashboardUseCase();

export async function getDashboardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const teacherId = (req as any).teacher?.id || 1; // TODO: use authenticated teacher id
    const result = await useCase.execute(teacherId, correlationId);
    res.status(200).json({ data: result, message: 'Dashboard data retrieved successfully' });
  } catch (err) {
    next(err);
  }
}
