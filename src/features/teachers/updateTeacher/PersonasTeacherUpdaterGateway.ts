import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { Teacher } from '../_types';
import { ITeacherUpdaterGateway, UpdateTeacherData } from './ITeacherUpdaterGateway';

// Concrete gateway wrapping PersonasClient. Kept inside the slice to ease future replacement.
export class PersonasTeacherUpdaterGateway implements ITeacherUpdaterGateway {
  private personas = new PersonasClient();

  async updateTeacher(id: number, data: UpdateTeacherData): Promise<Teacher> {
    return this.personas.updateTeacher(id, data);
  }
}
