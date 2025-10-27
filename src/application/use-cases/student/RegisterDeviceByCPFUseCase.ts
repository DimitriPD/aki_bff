import { PersonasClient } from '../../../infrastructure/http/clients';
import { ScanQRUseCase } from './ScanQRUseCase';
import { ApiResponse } from '../../../domain/dto';
import logger from '../../../shared/logger';

export class RegisterDeviceByCPFUseCase {
  private personasClient: PersonasClient;
  private scanQRUseCase: ScanQRUseCase;

  constructor() {
    this.personasClient = new PersonasClient();
    this.scanQRUseCase = new ScanQRUseCase();
  }

  async execute(data: { cpf: string; device_id: string; qr_token: string; location?: any }, correlationId: string): Promise<ApiResponse<any>> {
    logger.info('Register device by CPF requested', { cpf: data.cpf, deviceId: data.device_id, correlationId });

    // Bind device to student
    const student = await this.personasClient.getStudentByCPF(data.cpf);
    await this.personasClient.bindDevice(student.id, data.device_id);

    // Record attendance
    const attendanceResult = await this.scanQRUseCase.execute({
      qr_token: data.qr_token,
      device_id: data.device_id,
      student_cpf: data.cpf,
      location: data.location,
    }, correlationId);

    return {
      data: attendanceResult,
      message: 'Device registered and attendance recorded',
    };
  }
}
