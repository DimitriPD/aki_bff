import { Request, Response, NextFunction } from 'express';
import { RemoveStudentFromClassUseCase } from './RemoveStudentFromClassUseCase';
const useCase = new RemoveStudentFromClassUseCase();
export async function removeStudentFromClassHandler(req: Request, res: Response, next: NextFunction) { try { const classId = parseInt(req.params.id,10); const studentId = parseInt(req.params.studentId,10); await useCase.execute(classId, studentId); res.status(204).send(); } catch (e) { next(e); } }
