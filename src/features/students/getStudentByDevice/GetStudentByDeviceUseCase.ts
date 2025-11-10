import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { BadRequestError } from '../../../shared/errors';
export class GetStudentByDeviceUseCase { private personasClient = new PersonasClient(); async execute(device_id?: string) { if (!device_id) throw new BadRequestError('device_id is required'); return this.personasClient.getStudentByDevice(device_id); } }
