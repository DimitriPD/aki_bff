import { Request, Response, NextFunction } from 'express';
import { CreateClassUseCase } from './CreateClassUseCase';
const useCase = new CreateClassUseCase();
export async function createClassHandler(req: Request, res: Response, next: NextFunction) { try { const result = await useCase.execute(req.body); res.status(201).json(result); } catch (e) { next(e); } }
