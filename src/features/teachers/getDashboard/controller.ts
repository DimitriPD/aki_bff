import { Request, Response, NextFunction } from 'express';
import { GetTeacherDashboardUseCase } from './GetTeacherDashboardUseCase';
const useCase = new GetTeacherDashboardUseCase();
export async function getTeacherDashboardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const teacherId = parseInt(req.params.id, 10);
    const dashboard = await useCase.execute(teacherId, correlationId);
    res.json(dashboard);
  } catch (err) { next(err); }
}
