export interface Student {
  id: number;
  cpf: string;
  full_name: string;
  device_id?: string;
  created_at?: string;
  updated_at?: string;
}
export interface BindDeviceRequestDTO { cpf: string; device_id: string; }
export interface ScanQRRequestDTO { qr_token: string; device_id: string; student_cpf?: string; location?: any; }
export interface ScanQRResponseDTO {
  status: 'success' | 'error';
  message: string;
  attendance?: { id: string; event_id: string; student_name: string; timestamp: string; within_radius: boolean };
}
export interface ApiResponse<T> { data: T; meta?: any; message?: string; }
export interface PagedMeta { page: number; size: number; total: number; total_pages: number; }
export interface PagedResponse<T> { items: T[]; meta: PagedMeta; }