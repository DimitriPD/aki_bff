import { Request, Response } from 'express';
import { GetStudentProfileUseCase } from './GetStudentProfileUseCase';

const useCase = new GetStudentProfileUseCase();

export const getStudentProfileHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const profile = await useCase.execute(parseInt(id, 10), correlationId);
    res.json(profile);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      code: error.code || 'internal_error',
      message: error.message || 'Internal server error',
      details: error.details || [],
    });
  }
};
