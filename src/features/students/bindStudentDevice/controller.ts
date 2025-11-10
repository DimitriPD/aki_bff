import { Request, Response, NextFunction } from 'express';
import { BindStudentDeviceUseCase } from './BindStudentDeviceUseCase';
const useCase = new BindStudentDeviceUseCase();
export async function bindStudentDeviceHandler(req: Request, res: Response, next: NextFunction) { try { const { studentId } = req.query; const { device_id } = req.body; const result = await useCase.execute(studentId? parseInt(studentId as string,10): undefined, device_id); res.json(result); } catch (e) { next(e); } }
