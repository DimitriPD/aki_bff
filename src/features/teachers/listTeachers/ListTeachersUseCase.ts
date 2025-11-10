import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class ListTeachersUseCase { private personasClient = new PersonasClient(); async execute(params: { page?: number; size?: number }) { return this.personasClient.getTeachers(params); } }
