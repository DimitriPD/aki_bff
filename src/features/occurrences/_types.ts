export type OccurrenceType = 'student_not_in_class' | 'manual_note' | 'invalid_qr';
export interface Occurrence {
  id: string;
  type: OccurrenceType;
  teacher_id: number;
  student_cpf: string;
  class_id: number;
  description?: string;
  created_at: string;
  notified_to_institution: boolean;
}
export interface PagedMeta { page: number; size: number; total: number; total_pages: number; }
export interface PagedResponse<T> { items: T[]; meta: PagedMeta; }