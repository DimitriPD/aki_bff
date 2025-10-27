import { PersonasClient } from '../../../infrastructure/http/clients';
import { NotFoundError } from '../../../shared/errors';
import logger from '../../../shared/logger';

export class ClearDeviceUseCase {
  private personasClient: PersonasClient;

  constructor() {
    this.personasClient = new PersonasClient();
  }

  async execute(studentId: number, correlationId: string): Promise<{ status: string; message: string }> {
    logger.info('Clear device requested', { studentId, correlationId });

    // Get student
    const student = await this.personasClient.getStudent(studentId);
    if (!student) {
      throw new NotFoundError(`Student with id ${studentId} not found`, undefined, correlationId);
    }

  // Unlink device
  await this.personasClient.updateStudent(studentId, { device_id: '' });

    logger.info('Device cleared', { studentId, correlationId });
    return { status: 'success', message: 'Device unlinked from student' };
  }
}
