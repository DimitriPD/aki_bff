import { Request, Response, NextFunction } from 'express';
import { GetStudentByDeviceUseCase } from './GetStudentByDeviceUseCase';
const useCase = new GetStudentByDeviceUseCase();
export async function getStudentByDeviceHandler(req: Request, res: Response, next: NextFunction) { try { const { device_id } = req.query; const result = await useCase.execute(device_id as string | undefined); res.json(result); } catch (e) { next(e); } }
