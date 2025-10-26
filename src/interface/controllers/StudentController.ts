import { Request, Response, NextFunction } from 'express';
import { BindDeviceUseCase } from '../../application/use-cases/student/BindDeviceUseCase';
import { ScanQRUseCase } from '../../application/use-cases/student/ScanQRUseCase';
import { ApiResponse } from '../../domain/dto';

export class StudentController {
  private bindDeviceUseCase: BindDeviceUseCase;
  private scanQRUseCase: ScanQRUseCase;

  constructor() {
    this.bindDeviceUseCase = new BindDeviceUseCase();
    this.scanQRUseCase = new ScanQRUseCase();
  }

  async bindDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const result = await this.bindDeviceUseCase.execute(req.body, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Device bound successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async scanQR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const result = await this.scanQRUseCase.execute(req.body, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: result.status === 'success' ? 'Attendance recorded' : 'Scan processed',
      };

      const statusCode = result.status === 'success' ? 201 : 400;
      res.status(statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
