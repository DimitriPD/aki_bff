import { Request, Response, NextFunction } from 'express';
import { ScanQRUseCase } from './ScanQRUseCase';
const useCase = new ScanQRUseCase();
export async function scanQRHandler(req: Request, res: Response, next: NextFunction) { try { const correlationId = req.header('x-correlation-id') || 'no-correlation-id'; const result = await useCase.execute(req.body, correlationId); const statusCode = result.status === 'success' ? 201 : 400; res.status(statusCode).json({ data: result, message: result.status === 'success' ? 'Attendance recorded' : 'Scan processed' }); } catch (err) { next(err); } }
