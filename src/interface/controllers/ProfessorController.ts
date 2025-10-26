import { Request, Response, NextFunction } from 'express';
import { CreateEventUseCase } from '../../application/use-cases/professor/CreateEventUseCase';
import { GetEventUseCase } from '../../application/use-cases/professor/GetEventUseCase';
import { GetDashboardUseCase } from '../../application/use-cases/professor/GetDashboardUseCase';
import { ApiResponse } from '../../domain/dto';
import { CoreClient } from '../../infrastructure/http/clients/CoreClient';

export class ProfessorController {
  private createEventUseCase: CreateEventUseCase;
  private getEventUseCase: GetEventUseCase;
  private getDashboardUseCase: GetDashboardUseCase;
  private coreClient: CoreClient;

  constructor() {
    this.createEventUseCase = new CreateEventUseCase();
    this.getEventUseCase = new GetEventUseCase();
    this.getDashboardUseCase = new GetDashboardUseCase();
    this.coreClient = new CoreClient();
  }

  async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const result = await this.createEventUseCase.execute(req.body, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Event created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const { eventId } = req.params;
      const result = await this.getEventUseCase.execute(eventId, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Event retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventId } = req.params;
      const result = await this.coreClient.updateEvent(eventId, req.body);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Event updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventId } = req.params;
      await this.coreClient.deleteEvent(eventId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getEventQR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventId } = req.params;
      const result = await this.coreClient.getEventQR(eventId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'QR code retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const teacherId = req.teacher?.id || 1;
      const result = await this.getDashboardUseCase.execute(teacherId, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Dashboard data retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
