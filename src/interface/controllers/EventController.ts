import { Request, Response, NextFunction } from 'express';
import { GetEventsUseCase } from '../../application/use-cases/events/GetEventsUseCase';
import { CreateEventUseCase } from '../../application/use-cases/professor/CreateEventUseCase';
import { GetEventUseCase } from '../../application/use-cases/professor/GetEventUseCase';
import { CoreClient } from '../../infrastructure/http/clients/CoreClient';
import { ApiResponse } from '../../domain/dto';

export class EventController {
  private getEventsUseCase: GetEventsUseCase;
  private createEventUseCase: CreateEventUseCase;
  private getEventUseCase: GetEventUseCase;
  private coreClient: CoreClient;

  constructor() {
    this.getEventsUseCase = new GetEventsUseCase();
    this.createEventUseCase = new CreateEventUseCase();
    this.getEventUseCase = new GetEventUseCase();
    this.coreClient = new CoreClient();
  }

  async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const { page, size, class_id, teacher_id, status } = req.query;

      const result = await this.getEventsUseCase.execute(
        {
          page: page ? parseInt(page as string, 10) : 1,
          size: size ? parseInt(size as string, 10) : 50,
          class_id: class_id ? parseInt(class_id as string, 10) : undefined,
          teacher_id: teacher_id ? parseInt(teacher_id as string, 10) : undefined,
          status: status as string,
        },
        correlationId,
      );

      const response: ApiResponse<typeof result.items> = {
        data: result.items,
        meta: result.meta,
        message: 'Events retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
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
}
