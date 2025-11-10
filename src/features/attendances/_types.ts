// Attendance slice local types
import { Location } from '../events/_types';
export type AttendanceStatus = 'recorded' | 'manual' | 'retroactive' | 'invalid';
export interface Attendance {
  id: string;
  event_id: string;
  student_id: number;
  status: AttendanceStatus;
  timestamp: string;
  location?: Location;
  validation?: { within_radius: boolean; distance_meters: number; };
  created_by?: string;
  created_at?: string;
}
export interface AttendanceResponseDTO {
  id: string;
  event_id: string;
  student_id: number;
  student_name?: string;
  status: string;
  timestamp: string;
  location?: Location;
  validation?: { within_radius: boolean; distance_meters: number; };
}
export interface PagedMeta { page: number; size: number; total: number; total_pages: number; }
export interface PagedResponse<T> { items: T[]; meta: PagedMeta; }