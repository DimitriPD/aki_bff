import { Request, Response, NextFunction } from 'express';
import { CreateOccurrenceUseCase } from './CreateOccurrenceUseCase';
const useCase = new CreateOccurrenceUseCase();
export async function createOccurrenceHandler(req: Request, res: Response, next: NextFunction) {
  try { const correlationId = req.header('x-correlation-id') || 'no-correlation-id'; const result = await useCase.execute(req.body, correlationId); res.status(201).json({ data: result, message: 'Occurrence created successfully' }); } catch (err) { next(err); } }
