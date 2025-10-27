import { RegisterDeviceByCPFUseCase } from '../../application/use-cases/student/RegisterDeviceByCPFUseCase';
import { Request, Response, NextFunction } from 'express';
import { BindDeviceUseCase } from '../../application/use-cases/student/BindDeviceUseCase';
import { ScanQRUseCase } from '../../application/use-cases/student/ScanQRUseCase';
import { ApiResponse } from '../../domain/dto';
import { ClearDeviceUseCase } from '../../application/use-cases/student/ClearDeviceUseCase';

export class StudentController {
  private bindDeviceUseCase: BindDeviceUseCase;
  private scanQRUseCase: ScanQRUseCase;
  private clearDeviceUseCase: ClearDeviceUseCase;
  private registerDeviceByCPFUseCase: RegisterDeviceByCPFUseCase;

  constructor() {
    this.bindDeviceUseCase = new BindDeviceUseCase();
    this.scanQRUseCase = new ScanQRUseCase();
    this.clearDeviceUseCase = new ClearDeviceUseCase();
    this.registerDeviceByCPFUseCase = new RegisterDeviceByCPFUseCase();
  }
  async registerDeviceByCPF(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const { cpf, device_id, qr_token, location } = req.body;
      const result = await this.registerDeviceByCPFUseCase.execute({ cpf, device_id, qr_token, location }, correlationId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
  async clearDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const studentId = parseInt(req.params.studentId, 10);
      const result = await this.clearDeviceUseCase.execute(studentId, correlationId);
      const response: ApiResponse<typeof result> = {
        data: result,
        message: result.message,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
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
