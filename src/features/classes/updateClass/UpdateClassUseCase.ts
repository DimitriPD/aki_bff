import { PersonasClient } from '../../_shared/personas/PersonasClient';
export class UpdateClassUseCase { private personasClient = new PersonasClient(); async execute(id: number, data: { name?: string }) { return this.personasClient.updateClass(id, data); } }
