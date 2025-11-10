import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class DeleteStudentUseCase { private personasClient = new PersonasClient(); async execute(id: number) { await this.personasClient.deleteStudent(id); return { status: 'success' }; } }
