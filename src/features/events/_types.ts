// Event slice local types (migrated from domain/entities & domain/dto)
export interface Location { latitude: number; longitude: number; }
export type EventStatus = 'active' | 'closed' | 'canceled';
export interface Event {
  id: string;
  class_id: number;
  teacher_id: number;
  start_time: string;
  end_time: string;
  location: Location;
  qr_token?: string;
  status: EventStatus;
  created_at?: string;
  updated_at?: string;
}
export interface CreateEventRequestDTO {
  class_id: number;
  teacher_id: number;
  start_time: string;
  end_time: string;
  location: Location;
}
export interface UpdateEventRequestDTO {
  start_time?: string;
  end_time?: string;
  status?: 'active' | 'closed' | 'canceled';
}
export interface EventResponseDTO {
  id: string;
  class_id: number;
  class_name?: string;
  teacher_id: number;
  teacher_name?: string;
  start_time: string;
  end_time: string;
  location: Location;
  qr_token?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}
export interface QRResponseDTO {
  qr_token: string;
  event_id: string;
  expires_at: string;
  svg?: string;
}
export interface PagedMeta { page: number; size: number; total: number; total_pages: number; }
export interface PagedResponse<T> { items: T[]; meta: PagedMeta; }