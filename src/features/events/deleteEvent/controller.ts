import { Request, Response, NextFunction } from 'express';
import { DeleteEventUseCase } from './DeleteEventUseCase';
const useCase = new DeleteEventUseCase();
export async function deleteEventHandler(req: Request, res: Response, next: NextFunction) {
  try { const { eventId } = req.params; await useCase.execute(eventId); res.status(204).send(); } catch (err) { next(err); } }
