import { Request, Response, NextFunction } from 'express';
import { CreateTeacherUseCase } from './CreateTeacherUseCase';
const useCase = new CreateTeacherUseCase();
export async function createTeacherHandler(req: Request, res: Response, next: NextFunction) { try { const result = await useCase.execute(req.body); res.status(201).json(result); } catch (e) { next(e); } }
