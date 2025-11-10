import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { BadRequestError } from '../../../shared/errors';
export class AddStudentToClassUseCase { private personasClient = new PersonasClient(); async execute(classId: number, student_id?: number) { if (!student_id) throw new BadRequestError('student_id is required'); return this.personasClient.addStudentToClass(classId, student_id); } }
