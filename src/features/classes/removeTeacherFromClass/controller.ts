import { Request, Response, NextFunction } from 'express';
import { RemoveTeacherFromClassUseCase } from './RemoveTeacherFromClassUseCase';
const useCase = new RemoveTeacherFromClassUseCase();
export async function removeTeacherFromClassHandler(req: Request, res: Response, next: NextFunction) { try { const classId = parseInt(req.params.id,10); const teacherId = parseInt(req.params.teacherId,10); await useCase.execute(classId, teacherId); res.status(204).send(); } catch (e) { next(e); } }
