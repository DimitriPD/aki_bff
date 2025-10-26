import { Request, Response, NextFunction } from 'express';
import { GetAttendancesUseCase } from '../../application/use-cases/attendances/GetAttendancesUseCase';
import { CoreClient } from '../../infrastructure/http/clients/CoreClient';
import { ApiResponse } from '../../domain/dto';

export class AttendanceController {
  private getAttendancesUseCase: GetAttendancesUseCase;
  private coreClient: CoreClient;

  constructor() {
    this.getAttendancesUseCase = new GetAttendancesUseCase();
    this.coreClient = new CoreClient();
  }

  async getAttendances(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const { event_id, student_id, page, size } = req.query;

      const result = await this.getAttendancesUseCase.execute(
        {
          event_id: event_id as string,
          student_id: student_id ? parseInt(student_id as string, 10) : undefined,
          page: page ? parseInt(page as string, 10) : 1,
          size: size ? parseInt(size as string, 10) : 20,
        },
        correlationId,
      );

      const response: ApiResponse<typeof result.items> = {
        data: result.items,
        meta: result.meta,
        message: 'Attendances retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { attendanceId } = req.params;
      const result = await this.coreClient.getAttendance(attendanceId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Attendance retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { attendanceId } = req.params;
      const result = await this.coreClient.updateAttendance(attendanceId, req.body);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Attendance updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
