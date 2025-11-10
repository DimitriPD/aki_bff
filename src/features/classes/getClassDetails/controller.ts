import { Request, Response } from 'express';
import { GetClassDetailsUseCase } from './GetClassDetailsUseCase';

const useCase = new GetClassDetailsUseCase();

export const getClassDetailsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
    const details = await useCase.execute(parseInt(id, 10), correlationId);
    res.json(details);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      code: error.code || 'internal_error',
      message: error.message || 'Internal server error',
      details: error.details || [],
    });
  }
};
