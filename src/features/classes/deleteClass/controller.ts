import { Request, Response, NextFunction } from 'express';
import { DeleteClassUseCase } from './DeleteClassUseCase';
const useCase = new DeleteClassUseCase();
export async function deleteClassHandler(req: Request, res: Response, next: NextFunction) { try { const id = parseInt(req.params.id,10); await useCase.execute(id); res.status(204).send(); } catch (e) { next(e); } }
