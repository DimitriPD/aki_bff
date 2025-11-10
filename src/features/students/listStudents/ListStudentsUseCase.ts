import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class ListStudentsUseCase { private personasClient = new PersonasClient(); async execute(params: { page?: number; size?: number; q?: string }) { return this.personasClient.getStudents(params); } }
