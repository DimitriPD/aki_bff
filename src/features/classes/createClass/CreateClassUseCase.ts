import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { BadRequestError } from '../../../shared/errors';
export class CreateClassUseCase { private personasClient = new PersonasClient(); async execute(data: { name?: string }) { if (!data.name) throw new BadRequestError('name is required'); return this.personasClient.createClass({ name: data.name }); } }
