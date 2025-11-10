import { Request, Response, NextFunction } from 'express';
import { CreateEventUseCase } from './CreateEventUseCase';
const useCase = new CreateEventUseCase();
export async function createEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const result = await useCase.execute(req.body, correlationId);
    res.status(201).json({ data: result, message: 'Event created successfully' });
  } catch (err) { next(err); }
}
