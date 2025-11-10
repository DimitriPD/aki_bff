import { Request, Response, NextFunction } from 'express';
import { GetEventUseCase } from './GetEventUseCase';

const useCase = new GetEventUseCase();

export async function getEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const { eventId } = req.params;
    const result = await useCase.execute(eventId, correlationId);
    res.status(200).json({ data: result, message: 'Event retrieved successfully' });
  } catch (err) {
    next(err);
  }
}
