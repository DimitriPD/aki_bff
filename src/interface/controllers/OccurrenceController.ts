import { Request, Response, NextFunction } from 'express';
import { GetOccurrencesUseCase } from '../../application/use-cases/occurrences/GetOccurrencesUseCase';
import { CreateOccurrenceUseCase } from '../../application/use-cases/occurrences/CreateOccurrenceUseCase';
import { ApiResponse } from '../../domain/dto';

export class OccurrenceController {
  private getOccurrencesUseCase: GetOccurrencesUseCase;
  private createOccurrenceUseCase: CreateOccurrenceUseCase;

  constructor() {
    this.getOccurrencesUseCase = new GetOccurrencesUseCase();
    this.createOccurrenceUseCase = new CreateOccurrenceUseCase();
  }

  async getOccurrences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const { page, size, class_id, teacher_id } = req.query;

      const result = await this.getOccurrencesUseCase.execute(
        {
          page: page ? parseInt(page as string, 10) : 1,
          size: size ? parseInt(size as string, 10) : 50,
          class_id: class_id ? parseInt(class_id as string, 10) : undefined,
          teacher_id: teacher_id ? parseInt(teacher_id as string, 10) : undefined,
        },
        correlationId,
      );

      const response: ApiResponse<typeof result.items> = {
        data: result.items,
        meta: result.meta,
        message: 'Occurrences retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createOccurrence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const result = await this.createOccurrenceUseCase.execute(req.body, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Occurrence created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
