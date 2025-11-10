import { PersonasClient } from '../../../_shared/personas/PersonasClient';
import { BindDeviceRequestDTO } from '../../_types';
import { NotFoundError, ConflictError } from '../../../../shared/errors';
import logger from '../../../../shared/logger';

export class BindDeviceUseCase {
  private personasClient = new PersonasClient();
  async execute(data: BindDeviceRequestDTO, correlationId: string): Promise<{ status: string; message: string; student_id: number }> {
    logger.info('Device binding requested', { cpf: data.cpf, deviceId: data.device_id, correlationId });
    try {
      try {
        const existingStudent = await this.personasClient.getStudentByDevice(data.device_id);
        if (existingStudent.cpf === data.cpf) {
          return { status: 'success', message: 'Device already bound to this student', student_id: existingStudent.id };
        } else {
          throw new ConflictError('Device is already bound to another student', [{ device_id: data.device_id }], correlationId);
        }
      } catch (error: any) {
        if (error.statusCode !== 404) throw error;
      }
      const student = await this.personasClient.getStudentByCPF(data.cpf);
      if (!student) throw new NotFoundError(`Student with CPF ${data.cpf} not found`, undefined, correlationId);
      if (student.device_id && student.device_id !== data.device_id) {
        throw new ConflictError('Student already has a device bound. Please reset the device first.', [{ current_device: student.device_id }], correlationId);
      }
      const updatedStudent = await this.personasClient.bindDevice(student.id, data.device_id);
      logger.info('Device bound successfully', { studentId: updatedStudent.id, deviceId: data.device_id, correlationId });
      return { status: 'success', message: 'Device bound successfully', student_id: updatedStudent.id };
    } catch (error: any) {
      logger.error('Device binding failed', { error: error.message, correlationId });
      throw error;
    }
  }
}
