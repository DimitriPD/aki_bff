import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { BadRequestError } from '../../../shared/errors';

interface CreateTeacherDTO { cpf: string; full_name: string; email: string; password_hash?: string }

export class CreateTeacherUseCase {
	private personasClient = new PersonasClient();
	async execute(data: { cpf?: string; full_name?: string; email?: string; password_hash?: string }) {
		if (!data.cpf || !data.full_name || !data.email) {
			throw new BadRequestError('cpf, full_name, email are required');
		}
		const dto: CreateTeacherDTO = {
			cpf: data.cpf,
			full_name: data.full_name,
			email: data.email,
			...(data.password_hash ? { password_hash: data.password_hash } : {}),
		};
		return this.personasClient.createTeacher(dto);
	}
}
