import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { BadRequestError } from '../../../shared/errors';
export class CreateStudentUseCase { private personasClient = new PersonasClient(); async execute(data: { cpf?: string; full_name?: string }) { if (!data.cpf || !data.full_name) throw new BadRequestError('cpf and full_name are required'); return this.personasClient.createStudent({ cpf: data.cpf, full_name: data.full_name }); } }
