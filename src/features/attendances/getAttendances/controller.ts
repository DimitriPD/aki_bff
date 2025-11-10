import { Request, Response, NextFunction } from 'express';
import { GetAttendancesUseCase } from './GetAttendancesUseCase';

const useCase = new GetAttendancesUseCase();

export async function getAttendancesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const { event_id, student_id, page, size } = req.query;

    const result = await useCase.execute(
      {
        event_id: event_id as string,
        student_id: student_id ? parseInt(student_id as string, 10) : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        size: size ? parseInt(size as string, 10) : 20,
      },
      correlationId,
    );

    res.status(200).json({
      data: result.items,
      meta: result.meta,
      message: 'Attendances retrieved successfully',
    });
  } catch (err) {
    next(err);
  }
}
