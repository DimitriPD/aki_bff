import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { BadRequestError } from '../../../shared/errors';
export class BindStudentDeviceUseCase { private personasClient = new PersonasClient(); async execute(studentId?: number, device_id?: string) { if (!studentId) throw new BadRequestError('studentId is required'); if (!device_id) throw new BadRequestError('device_id is required'); return this.personasClient.bindDevice(studentId, device_id); } }
