import { Request, Response, NextFunction } from 'express';
import { GetEventsUseCase } from './GetEventsUseCase';

const useCase = new GetEventsUseCase();

export async function getEventsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const { page, size, class_id, teacher_id, status } = req.query;
    const result = await useCase.execute({
      page: page ? parseInt(page as string, 10) : 1,
      size: size ? parseInt(size as string, 10) : 50,
      class_id: class_id ? parseInt(class_id as string, 10) : undefined,
      teacher_id: teacher_id ? parseInt(teacher_id as string, 10) : undefined,
      status: status as string,
    }, correlationId);
    res.status(200).json({ data: result.items, meta: result.meta, message: 'Events retrieved successfully' });
  } catch (err) { next(err); }
}
