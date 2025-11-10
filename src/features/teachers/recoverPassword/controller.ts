import { Request, Response, NextFunction } from 'express';
import { RecoverPasswordUseCase } from './RecoverPasswordUseCase';
const useCase = new RecoverPasswordUseCase();
export async function recoverPasswordHandler(req: Request, res: Response, next: NextFunction) { try { const { teacher_email } = req.body; const result = await useCase.execute(teacher_email); res.json(result); } catch (e) { next(e); } }
