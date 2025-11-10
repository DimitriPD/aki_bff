import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class RemoveStudentFromClassUseCase { private personasClient = new PersonasClient(); async execute(classId: number, studentId: number) { await this.personasClient.removeStudentFromClass(classId, studentId); return { status: 'success' }; } }
