import { PersonasClient } from '../../../infrastructure/http/clients';
import { BindDeviceRequestDTO } from '../../../domain/dto';
import { NotFoundError, ConflictError } from '../../../shared/errors';
import logger from '../../../shared/logger';

export class BindDeviceUseCase {
  private personasClient: PersonasClient;

  constructor() {
    this.personasClient = new PersonasClient();
  }

  async execute(
    data: BindDeviceRequestDTO,
    correlationId: string,
  ): Promise<{ status: string; message: string; student_id: number }> {
    logger.info('Device binding requested', { cpf: data.cpf, deviceId: data.device_id, correlationId });

    try {
      // Check if device is already bound
      try {
        const existingStudent = await this.personasClient.getStudentByDevice(data.device_id);
        
        if (existingStudent.cpf === data.cpf) {
          // Device already bound to same student - idempotent operation
          return {
            status: 'success',
            message: 'Device already bound to this student',
            student_id: existingStudent.id,
          };
        } else {
          // Device bound to different student
          throw new ConflictError(
            'Device is already bound to another student',
            [{ device_id: data.device_id }],
            correlationId,
          );
        }
      } catch (error: any) {
        // Device not found - proceed with binding
        if (error.statusCode !== 404) {
          throw error;
        }
      }

      // Get student by CPF
      const student = await this.personasClient.getStudentByCPF(data.cpf);

      if (!student) {
        throw new NotFoundError(`Student with CPF ${data.cpf} not found`, undefined, correlationId);
      }

      // Check if student already has a device
      if (student.device_id && student.device_id !== data.device_id) {
        throw new ConflictError(
          'Student already has a device bound. Please reset the device first.',
          [{ current_device: student.device_id }],
          correlationId,
        );
      }

      // Bind device to student
      const updatedStudent = await this.personasClient.bindDevice(student.id, data.device_id);

      logger.info('Device bound successfully', {
        studentId: updatedStudent.id,
        deviceId: data.device_id,
        correlationId,
      });

      return {
        status: 'success',
        message: 'Device bound successfully',
        student_id: updatedStudent.id,
      };
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }

      logger.error('Device binding failed', { error: error.message, correlationId });
      throw error;
    }
  }
}
