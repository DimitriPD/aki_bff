import { Request, Response, NextFunction } from 'express';
import { ListStudentsUseCase } from './ListStudentsUseCase';
const useCase = new ListStudentsUseCase();
export async function listStudentsHandler(req: Request, res: Response, next: NextFunction) { try { const { page, size, q } = req.query; const result = await useCase.execute({ page: page? parseInt(page as string,10): undefined, size: size? parseInt(size as string,10): undefined, q: q as string | undefined }); res.json(result); } catch (e) { next(e); } }
