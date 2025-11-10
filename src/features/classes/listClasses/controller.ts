import { Request, Response, NextFunction } from 'express';
import { ListClassesUseCase } from './ListClassesUseCase';
const useCase = new ListClassesUseCase();
export async function listClassesHandler(req: Request, res: Response, next: NextFunction) { try { const { page, size } = req.query; const result = await useCase.execute({ page: page? parseInt(page as string,10): undefined, size: size? parseInt(size as string,10): undefined }); res.json(result); } catch (e) { next(e); } }
