import { BadRequestError } from '../../../shared/errors';
import { Teacher } from '../_types';
import { ITeacherUpdaterGateway, UpdateTeacherData } from './ITeacherUpdaterGateway';
import { PersonasTeacherUpdaterGateway } from './PersonasTeacherUpdaterGateway';

export class UpdateTeacherUseCase {
	// Allow dependency injection for testability; default to Personas implementation.
	constructor(private readonly gateway: ITeacherUpdaterGateway = new PersonasTeacherUpdaterGateway()) {}

	async execute(id: number, data: UpdateTeacherData): Promise<Teacher> {
		if (!id || id <= 0) {
			throw new BadRequestError('Invalid teacher id');
		}
		if (!data || Object.keys(data).length === 0) {
			throw new BadRequestError('No fields provided to update');
		}
		if (data.email && !this.isValidEmail(data.email)) {
			throw new BadRequestError('Invalid email format');
		}

		// Simple normalization
		if (data.full_name) {
			data.full_name = data.full_name.trim();
		}
		if (data.email) {
			data.email = data.email.trim().toLowerCase();
		}

		return this.gateway.updateTeacher(id, data);
	}

	private isValidEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
}

