import { Request, Response, NextFunction } from 'express';
import { DeleteStudentUseCase } from './DeleteStudentUseCase';
const useCase = new DeleteStudentUseCase();
export async function deleteStudentHandler(req: Request, res: Response, next: NextFunction) { try { const id = parseInt(req.params.id,10); await useCase.execute(id); res.status(204).send(); } catch (e) { next(e); } }
