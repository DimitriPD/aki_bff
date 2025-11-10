import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class ListClassesUseCase { private personasClient = new PersonasClient(); async execute(params: { page?: number; size?: number }) { return this.personasClient.getClasses(params); } }
