import { Request, Response, NextFunction } from 'express';
import { GetClassStudentsUseCase } from './GetClassStudentsUseCase';
const useCase = new GetClassStudentsUseCase();
export async function getClassStudentsHandler(req: Request, res: Response, next: NextFunction) { try { const id = parseInt(req.params.id,10); const result = await useCase.execute(id); res.json(result); } catch (e) { next(e); } }
