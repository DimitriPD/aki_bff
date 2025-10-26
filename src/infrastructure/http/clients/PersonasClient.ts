import { HttpClient } from '../HttpClient';
import { config } from '../../config';
import { IPersonasClient } from '../../../domain/interfaces';
import { Student, Teacher, Class } from '../../../domain/entities';
import { ApiResponse, PagedResponse } from '../../../domain/dto';
import { NotFoundError } from '../../../shared/errors';

export class PersonasClient implements IPersonasClient {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient({
      baseURL: config.services.personas.baseUrl,
      timeout: config.services.personas.timeout,
      maxRetries: config.http.maxRetries,
      retryDelay: config.http.retryDelay,
    });
  }

  // ==================== STUDENTS ====================

  async getStudents(params?: {
    page?: number;
    size?: number;
    q?: string;
  }): Promise<PagedResponse<Student>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.q) queryParams.append('q', params.q);
    
    const query = queryParams.toString();
    return this.http.get<PagedResponse<Student>>(`/students${query ? `?${query}` : ''}`);
  }

  async getStudent(id: number): Promise<Student> {
    return this.http.get<Student>(`/students/${id}`);
  }

  async createStudent(data: { cpf: string; full_name: string }): Promise<Student> {
    return this.http.post<Student>('/students', data);
  }

  async updateStudent(
    id: number,
    data: { full_name?: string; device_id?: string }
  ): Promise<Student> {
    return this.http.put<Student>(`/students/${id}`, data);
  }

  async deleteStudent(id: number): Promise<void> {
    await this.http.delete(`/students/${id}`);
  }

  async getStudentByDevice(deviceId: string): Promise<Student> {
    try {
      return await this.http.get<Student>(`/students/device?device_id=${deviceId}`);
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new NotFoundError(`Student with device ${deviceId} not found`);
      }
      throw error;
    }
  }

  async bindDevice(studentId: number, deviceId: string): Promise<Student> {
    return this.http.put<Student>(`/students/device?studentId=${studentId}`, {
      device_id: deviceId,
    });
  }

  async getStudentByCPF(cpf: string): Promise<Student> {
    const students = await this.http.get<PagedResponse<Student>>(`/students?q=${cpf}`);
    if (!students.items || students.items.length === 0) {
      throw new NotFoundError(`Student with CPF ${cpf} not found`);
    }
    return students.items[0];
  }

  // ==================== TEACHERS ====================

  async getTeachers(params?: {
    page?: number;
    size?: number;
  }): Promise<PagedResponse<Teacher>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    
    const query = queryParams.toString();
    return this.http.get<PagedResponse<Teacher>>(`/teachers${query ? `?${query}` : ''}`);
  }

  async getTeacher(id: number): Promise<Teacher> {
    return this.http.get<Teacher>(`/teachers/${id}`);
  }

  async createTeacher(data: {
    cpf: string;
    full_name: string;
    email: string;
    password_hash?: string;
  }): Promise<Teacher> {
    return this.http.post<Teacher>('/teachers', data);
  }

  async updateTeacher(
    id: number,
    data: { full_name?: string; email?: string; password_hash?: string }
  ): Promise<Teacher> {
    return this.http.put<Teacher>(`/teachers/${id}`, data);
  }

  async deleteTeacher(id: number): Promise<void> {
    await this.http.delete(`/teachers/${id}`);
  }

  async recoverPassword(teacherEmail: string): Promise<{
    status: string;
    teacher_email: string;
    sent_at: string;
  }> {
    return this.http.post<{
      status: string;
      teacher_email: string;
      sent_at: string;
    }>('/teachers/recover-password', {
      teacher_email: teacherEmail,
    });
  }

  async getTeacherByEmail(email: string): Promise<Teacher> {
    const teachers = await this.http.get<PagedResponse<Teacher>>(`/teachers?email=${email}`);
    if (!teachers.items || teachers.items.length === 0) {
      throw new NotFoundError(`Teacher with email ${email} not found`);
    }
    return teachers.items[0];
  }

  async updateTeacherPassword(teacherId: number, passwordHash: string): Promise<Teacher> {
    return this.http.put<Teacher>(`/teachers/${teacherId}`, {
      password_hash: passwordHash,
    });
  }

  // ==================== CLASSES ====================

  async getClasses(params?: {
    page?: number;
    size?: number;
  }): Promise<PagedResponse<Class>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    
    const query = queryParams.toString();
    return this.http.get<PagedResponse<Class>>(`/classes${query ? `?${query}` : ''}`);
  }

  async getClass(id: number): Promise<Class> {
    return this.http.get<Class>(`/classes/${id}`);
  }

  async createClass(data: { name: string }): Promise<Class> {
    return this.http.post<Class>('/classes', data);
  }

  async updateClass(id: number, data: { name?: string }): Promise<Class> {
    return this.http.put<Class>(`/classes/${id}`, data);
  }

  async deleteClass(id: number): Promise<void> {
    await this.http.delete(`/classes/${id}`);
  }

  async getClassWithMembers(id: number): Promise<{
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    students: Student[];
    teachers: Teacher[];
  }> {
    return this.http.get<{
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
      students: Student[];
      teachers: Teacher[];
    }>(`/classes/${id}`);
  }

  async getClassStudents(classId: number): Promise<Student[]> {
    return this.http.get<Student[]>(`/classes/${classId}/students`);
  }

  async addStudentToClass(
    classId: number,
    studentId: number
  ): Promise<{
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    students: Student[];
    teachers: Teacher[];
  }> {
    return this.http.post<{
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
      students: Student[];
      teachers: Teacher[];
    }>(`/classes/${classId}/students`, { student_id: studentId });
  }

  async removeStudentFromClass(classId: number, studentId: number): Promise<void> {
    await this.http.delete(`/classes/${classId}/students/${studentId}`);
  }

  async removeTeacherFromClass(classId: number, teacherId: number): Promise<void> {
    await this.http.delete(`/classes/${classId}/teachers/${teacherId}`);
  }

  async getTeacherClasses(teacherId: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`/teachers/${teacherId}/classes`);
  }

  // ==================== ADMIN ====================

  async syncData(data: {
    source: string;
    timestamp: string;
    changes: {
      students?: Array<{ action: 'create' | 'update' | 'delete'; record: any }>;
      teachers?: Array<{ action: 'create' | 'update' | 'delete'; record: any }>;
      classes?: Array<{ action: 'create' | 'update' | 'delete'; record: any }>;
    };
  }): Promise<{
    processed: number;
    created: number;
    updated: number;
    deleted: number;
  }> {
    return this.http.post<{
      processed: number;
      created: number;
      updated: number;
      deleted: number;
    }>('/admin/sync', data);
  }
}
