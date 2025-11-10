import { Request, Response, NextFunction } from 'express';
import { ClearDeviceUseCase } from './ClearDeviceUseCase';
const useCase = new ClearDeviceUseCase();
export async function clearDeviceHandler(req: Request, res: Response, next: NextFunction) { try { const correlationId = req.header('x-correlation-id') || 'no-correlation-id'; const studentId = parseInt(req.params.studentId, 10); const result = await useCase.execute(studentId, correlationId); res.status(200).json({ data: result, message: result.message }); } catch (err) { next(err); } }
