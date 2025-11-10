import { Request, Response, NextFunction } from 'express';
import { UpdateTeacherUseCase } from './UpdateTeacherUseCase';
const useCase = new UpdateTeacherUseCase();
export async function updateTeacherHandler(req: Request, res: Response, next: NextFunction) { try { const id = parseInt(req.params.id,10); const result = await useCase.execute(id, req.body); res.json(result); } catch (e) { next(e); } }
