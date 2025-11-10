import { Request, Response, NextFunction } from 'express';
import { UpdateEventUseCase } from './UpdateEventUseCase';
const useCase = new UpdateEventUseCase();
export async function updateEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params; const result = await useCase.execute(eventId, req.body);
    res.status(200).json({ data: result, message: 'Event updated successfully' });
  } catch (err) { next(err); }
}
