import { Request, Response, NextFunction } from 'express';
import { GetEventQRUseCase } from './GetEventQRUseCase';
const useCase = new GetEventQRUseCase();
export async function getEventQRHandler(req: Request, res: Response, next: NextFunction) {
  try { const { eventId } = req.params; const result = await useCase.execute(eventId); res.status(200).json({ data: result, message: 'QR code retrieved successfully' }); } catch (err) { next(err); } }
