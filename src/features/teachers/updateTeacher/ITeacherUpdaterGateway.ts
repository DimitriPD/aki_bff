import { Teacher } from '../_types';

export interface UpdateTeacherData {
  full_name?: string;
  email?: string;
  password_hash?: string;
}

export interface ITeacherUpdaterGateway {
  updateTeacher(id: number, data: UpdateTeacherData): Promise<Teacher>;
}
