import { Request, Response, NextFunction } from 'express';
import { UpdateStudentUseCase } from './UpdateStudentUseCase';
const useCase = new UpdateStudentUseCase();
export async function updateStudentHandler(req: Request, res: Response, next: NextFunction) { try { const id = parseInt(req.params.id,10); const result = await useCase.execute(id, req.body); res.json(result); } catch (e) { next(e); } }
