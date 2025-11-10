import { Request, Response, NextFunction } from 'express';
import { ListTeachersUseCase } from './ListTeachersUseCase';
const useCase = new ListTeachersUseCase();
export async function listTeachersHandler(req: Request, res: Response, next: NextFunction) { try { const { page, size } = req.query; const result = await useCase.execute({ page: page? parseInt(page as string,10): undefined, size: size? parseInt(size as string,10): undefined }); res.json(result); } catch (e) { next(e); } }
