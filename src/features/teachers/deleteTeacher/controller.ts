import { Request, Response, NextFunction } from 'express';
import { DeleteTeacherUseCase } from './DeleteTeacherUseCase';
const useCase = new DeleteTeacherUseCase();
export async function deleteTeacherHandler(req: Request, res: Response, next: NextFunction) { try { const id = parseInt(req.params.id,10); await useCase.execute(id); res.status(204).send(); } catch (e) { next(e); } }
