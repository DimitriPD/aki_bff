import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class RemoveTeacherFromClassUseCase { private personasClient = new PersonasClient(); async execute(classId: number, teacherId: number) { await this.personasClient.removeTeacherFromClass(classId, teacherId); return { status: 'success' }; } }
