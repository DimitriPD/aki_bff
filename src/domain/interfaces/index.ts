import { Event, Student, Teacher, Class, Attendance } from '../entities';
import { ApiResponse, PagedResponse } from '../dto';

export interface IPersonasClient {
  // Students
  getStudents(params?: { page?: number; size?: number; q?: string }): Promise<PagedResponse<Student>>;
  getStudent(id: number): Promise<Student>;
  createStudent(data: { cpf: string; full_name: string }): Promise<Student>;
  updateStudent(id: number, data: { full_name?: string; device_id?: string }): Promise<Student>;
  deleteStudent(id: number): Promise<void>;
  getStudentByDevice(deviceId: string): Promise<Student>;
  getStudentByCPF(cpf: string): Promise<Student>;
  bindDevice(studentId: number, deviceId: string): Promise<Student>;
  
  // Teachers
  getTeachers(params?: { page?: number; size?: number }): Promise<PagedResponse<Teacher>>;
  getTeacher(id: number): Promise<Teacher>;
  createTeacher(data: { cpf: string; full_name: string; email: string; password_hash?: string }): Promise<Teacher>;
  updateTeacher(id: number, data: { full_name?: string; email?: string; password_hash?: string }): Promise<Teacher>;
  deleteTeacher(id: number): Promise<void>;
  recoverPassword(teacherEmail: string): Promise<{ status: string; teacher_email: string; sent_at: string }>;
  getTeacherByEmail(email: string): Promise<Teacher>;
  updateTeacherPassword(teacherId: number, passwordHash: string): Promise<Teacher>;
  
  // Classes
  getClasses(params?: { page?: number; size?: number }): Promise<PagedResponse<Class>>;
  getClass(id: number): Promise<Class>;
  createClass(data: { name: string }): Promise<Class>;
  updateClass(id: number, data: { name?: string }): Promise<Class>;
  deleteClass(id: number): Promise<void>;
  getClassWithMembers(id: number): Promise<{
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    students: Student[];
    teachers: Teacher[];
  }>;
  getClassStudents(classId: number): Promise<Student[]>;
  addStudentToClass(classId: number, studentId: number): Promise<{
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    students: Student[];
    teachers: Teacher[];
  }>;
  removeStudentFromClass(classId: number, studentId: number): Promise<void>;
  removeTeacherFromClass(classId: number, teacherId: number): Promise<void>;
  getTeacherClasses(teacherId: number): Promise<ApiResponse<any>>;
  
  // Admin
  syncData(data: {
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
  }>;
}

export interface ICoreClient {
  createEvent(data: any): Promise<Event>;
  getEvent(id: string): Promise<Event>;
  updateEvent(id: string, data: any): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  getEventQR(id: string): Promise<any>;
  createAttendance(data: any): Promise<Attendance>;
  getAttendances(filters: any): Promise<PagedResponse<Attendance>>;
  getOccurrences(filters: any): Promise<PagedResponse<any>>;
}

export interface IFunctionPasswordClient {
  sendForgotPasswordEmail(email: string): Promise<{ status: string }>;
  validateResetToken(token: string): Promise<{ valid: boolean; teacher_email?: string }>;
}

export interface IFunctionNotificationClient {
  sendNotification(data: {
    class_id: number;
    teacher_id: number;
    message: string;
  }): Promise<{ status: string; notification_id: number }>;
}
