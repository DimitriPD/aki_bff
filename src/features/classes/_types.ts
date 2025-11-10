import { Student } from '../students/_types';
import { Teacher } from '../teachers/_types';
export interface Class { id: number; name: string; created_at?: string; updated_at?: string; }
export interface ClassWithMembers { id: number; name: string; students: Student[]; teachers: Teacher[]; created_at?: string; updated_at?: string; }
export interface PagedMeta { page: number; size: number; total: number; total_pages: number; }
export interface PagedResponse<T> { items: T[]; meta: PagedMeta; }