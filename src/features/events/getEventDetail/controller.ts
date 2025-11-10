import { Request, Response, NextFunction } from 'express';
import { GetEventDetailUseCase } from './GetEventDetailUseCase';
const useCase = new GetEventDetailUseCase();
export async function getEventDetailHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params;
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const result = await useCase.execute(eventId, correlationId);
    res.status(200).json({ data: result, message: 'Event details retrieved successfully' });
  } catch (err) { next(err); }
}
