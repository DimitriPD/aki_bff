import { UpdateTeacherUseCase } from '../UpdateTeacherUseCase';
import { ITeacherUpdaterGateway, UpdateTeacherData } from '../ITeacherUpdaterGateway';
import { Teacher } from '../../_types';
import { BadRequestError } from '../../../../shared/errors';

describe('UpdateTeacherUseCase', () => {
  const teacher: Teacher = {
    id: 1,
    cpf: '12345678900',
    full_name: 'John Doe',
    email: 'john@doe.com',
    password_hash: 'hash',
    created_at: '2023-01-01',
    updated_at: '2023-01-02',
  };

  class MockGateway implements ITeacherUpdaterGateway {
    async updateTeacher(id: number, data: UpdateTeacherData): Promise<Teacher> {
      return { ...teacher, ...data, id };
    }
  }

  it('should update teacher with valid data', async () => {
    const useCase = new UpdateTeacherUseCase(new MockGateway());
    const result = await useCase.execute(1, { full_name: 'Jane Doe', email: 'jane@doe.com' });
    expect(result.full_name).toBe('Jane Doe');
    expect(result.email).toBe('jane@doe.com');
    expect(result.id).toBe(1);
  });

  it('should throw BadRequestError for invalid id', async () => {
    const useCase = new UpdateTeacherUseCase(new MockGateway());
    await expect(useCase.execute(0, { full_name: 'Jane Doe' })).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError for empty data', async () => {
    const useCase = new UpdateTeacherUseCase(new MockGateway());
    await expect(useCase.execute(1, {})).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError for invalid email', async () => {
    const useCase = new UpdateTeacherUseCase(new MockGateway());
    await expect(useCase.execute(1, { email: 'invalid-email' })).rejects.toThrow(BadRequestError);
  });

  it('should normalize email and full_name', async () => {
    const useCase = new UpdateTeacherUseCase(new MockGateway());
    const result = await useCase.execute(1, { full_name: '  Jane Doe  ', email: 'JANE@DOE.COM ' });
    expect(result.full_name).toBe('Jane Doe');
    expect(result.email).toBe('jane@doe.com');
  });
});
