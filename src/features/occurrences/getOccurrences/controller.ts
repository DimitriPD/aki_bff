import { Request, Response, NextFunction } from 'express';
import { GetOccurrencesUseCase } from './GetOccurrencesUseCase';
const useCase = new GetOccurrencesUseCase();
export async function getOccurrencesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, size, class_id, teacher_id } = req.query;
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const result = await useCase.execute({
      page: page ? parseInt(page as string, 10) : 1,
      size: size ? parseInt(size as string, 10) : 50,
      class_id: class_id ? parseInt(class_id as string, 10) : undefined,
      teacher_id: teacher_id ? parseInt(teacher_id as string, 10) : undefined,
    }, correlationId);
    res.status(200).json({ data: result.items, meta: result.meta, message: 'Occurrences retrieved successfully' });
  } catch (err) { next(err); }
}
