export interface Teacher {
  id: number;
  cpf: string;
  full_name: string;
  email: string;
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
}
export interface PagedMeta { page: number; size: number; total: number; total_pages: number; }
export interface PagedResponse<T> { items: T[]; meta: PagedMeta; }