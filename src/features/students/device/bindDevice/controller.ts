import { Request, Response, NextFunction } from 'express';
import { BindDeviceUseCase } from './BindDeviceUseCase';
const useCase = new BindDeviceUseCase();
export async function bindDeviceHandler(req: Request, res: Response, next: NextFunction) {
  try { const correlationId = req.header('x-correlation-id') || 'no-correlation-id'; const result = await useCase.execute(req.body, correlationId); res.status(201).json({ data: result, message: 'Device bound successfully' }); } catch (err) { next(err); } }
