import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class GetClassStudentsUseCase { private personasClient = new PersonasClient(); async execute(id: number) { return this.personasClient.getClassStudents(id); } }
