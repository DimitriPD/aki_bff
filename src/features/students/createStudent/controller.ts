import { Request, Response, NextFunction } from 'express';
import { CreateStudentUseCase } from './CreateStudentUseCase';
const useCase = new CreateStudentUseCase();
export async function createStudentHandler(req: Request, res: Response, next: NextFunction) { try { const result = await useCase.execute(req.body); res.status(201).json(result); } catch (e) { next(e); } }
