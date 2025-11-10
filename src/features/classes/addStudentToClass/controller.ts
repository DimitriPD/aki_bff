import { Request, Response, NextFunction } from 'express';
import { AddStudentToClassUseCase } from './AddStudentToClassUseCase';
const useCase = new AddStudentToClassUseCase();
export async function addStudentToClassHandler(req: Request, res: Response, next: NextFunction) { try { const classId = parseInt(req.params.id,10); const { student_id } = req.body; const result = await useCase.execute(classId, student_id? parseInt(student_id,10): undefined); res.status(201).json(result); } catch (e) { next(e); } }
