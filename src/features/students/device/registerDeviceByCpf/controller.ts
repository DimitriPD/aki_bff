import { Request, Response, NextFunction } from 'express';
import { RegisterDeviceByCPFUseCase } from './RegisterDeviceByCPFUseCase';
const useCase = new RegisterDeviceByCPFUseCase();
export async function registerDeviceByCPFHandler(req: Request, res: Response, next: NextFunction) { try { const correlationId = req.header('x-correlation-id') || 'no-correlation-id'; const { cpf, device_id, qr_token, location } = req.body; const result = await useCase.execute({ cpf, device_id, qr_token, location }, correlationId); res.status(201).json(result); } catch (err) { next(err); } }
