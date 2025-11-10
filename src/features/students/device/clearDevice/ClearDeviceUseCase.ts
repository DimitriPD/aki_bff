import { PersonasClient } from '../../../_shared/personas/PersonasClient';
import { NotFoundError } from '../../../../shared/errors';
import logger from '../../../../shared/logger';
export class ClearDeviceUseCase { private personasClient = new PersonasClient(); async execute(studentId: number, correlationId: string) { logger.info('Clear device requested', { studentId, correlationId }); const student = await this.personasClient.getStudent(studentId); if (!student) throw new NotFoundError(`Student with id ${studentId} not found`, undefined, correlationId); await this.personasClient.updateStudent(studentId, { device_id: '' }); logger.info('Device cleared', { studentId, correlationId }); return { status: 'success', message: 'Device unlinked from student' }; } }
