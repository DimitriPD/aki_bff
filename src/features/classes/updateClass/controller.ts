import { Request, Response, NextFunction } from 'express';
import { UpdateClassUseCase } from './UpdateClassUseCase';
const useCase = new UpdateClassUseCase();
export async function updateClassHandler(req: Request, res: Response, next: NextFunction) { try { const id = parseInt(req.params.id,10); const result = await useCase.execute(id, req.body); res.json(result); } catch (e) { next(e); } }
