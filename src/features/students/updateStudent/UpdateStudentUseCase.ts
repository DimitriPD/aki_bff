import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class UpdateStudentUseCase { private personasClient = new PersonasClient(); async execute(id: number, data: { full_name?: string; device_id?: string }) { return this.personasClient.updateStudent(id, data); } }
