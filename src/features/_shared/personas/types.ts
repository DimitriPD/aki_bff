import { Student } from '../../students/_types';
import { Teacher } from '../../teachers/_types';
import { Class } from '../../classes/_types';

export interface IPersonasClient {
  getStudents(params?: { page?: number; size?: number; q?: string }): Promise<{ items: Student[]; meta: any }>;
  getStudent(id: number): Promise<Student>;
  createStudent(data: { cpf: string; full_name: string }): Promise<Student>;
  updateStudent(id: number, data: { full_name?: string; device_id?: string }): Promise<Student>;
  deleteStudent(id: number): Promise<void>;
  getStudentByDevice(deviceId: string): Promise<Student>;
  getStudentByCPF(cpf: string): Promise<Student>;
  bindDevice(studentId: number, deviceId: string): Promise<Student>;
  getTeachers(params?: { page?: number; size?: number }): Promise<{ items: Teacher[]; meta: any }>;
  getTeacher(id: number): Promise<Teacher>;
  createTeacher(data: { cpf: string; full_name: string; email: string; password_hash?: string }): Promise<Teacher>;
  updateTeacher(id: number, data: { full_name?: string; email?: string; password_hash?: string }): Promise<Teacher>;
  deleteTeacher(id: number): Promise<void>;
  recoverPassword(teacherEmail: string): Promise<{ status: string; teacher_email: string; sent_at: string }>;
  getTeacherByEmail(email: string): Promise<Teacher>;
  updateTeacherPassword(teacherId: number, passwordHash: string): Promise<Teacher>;
  getClasses(params?: { page?: number; size?: number }): Promise<{ items: Class[]; meta: any }>;
  getClass(id: number): Promise<Class>;
  createClass(data: { name: string }): Promise<Class>;
  updateClass(id: number, data: { name?: string }): Promise<Class>;
  deleteClass(id: number): Promise<void>;
  getClassWithMembers(id: number): Promise<{ id: number; name: string; created_at: string; updated_at: string; students: Student[]; teachers: Teacher[] }>;
  getClassStudents(classId: number): Promise<Student[]>;
  addStudentToClass(classId: number, studentId: number): Promise<{ id: number; name: string; created_at: string; updated_at: string; students: Student[]; teachers: Teacher[] }>;
  removeStudentFromClass(classId: number, studentId: number): Promise<void>;
  removeTeacherFromClass(classId: number, teacherId: number): Promise<void>;
  getTeacherClasses(teacherId: number): Promise<{ data: any; meta?: any; message?: string }>;
  syncData(data: any): Promise<{ processed: number; created: number; updated: number; deleted: number }>;
}
