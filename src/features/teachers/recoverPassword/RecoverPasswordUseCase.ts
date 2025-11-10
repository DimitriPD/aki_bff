import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { BadRequestError } from '../../../shared/errors';
export class RecoverPasswordUseCase { private personasClient = new PersonasClient(); async execute(email?: string) { if (!email) throw new BadRequestError('teacher_email is required'); return this.personasClient.recoverPassword(email); } }
