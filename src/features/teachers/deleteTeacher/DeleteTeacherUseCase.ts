import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class DeleteTeacherUseCase { private personasClient = new PersonasClient(); async execute(id: number) { await this.personasClient.deleteTeacher(id); return { status: 'success' }; } }
