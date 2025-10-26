import { Location } from '../entities';

// Auth DTOs
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  teacher: {
    id: number;
    full_name: string;
    email: string;
  };
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  new_password: string;
}

// Event DTOs
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
  class_name: string;
  teacher_id: number;
  teacher_name: string;
  start_time: string;
  end_time: string;
  location: Location;
  qr_token?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface QRResponseDTO {
  qr_token: string;
  event_id: string;
  expires_at: string;
  svg?: string;
}

// Student / Attendance DTOs
export interface BindDeviceRequestDTO {
  cpf: string;
  device_id: string;
}

export interface ScanQRRequestDTO {
  qr_token: string;
  device_id: string;
  student_cpf?: string;
  location?: Location;
}

export interface ScanQRResponseDTO {
  status: 'success' | 'error';
  message: string;
  attendance?: {
    id: string;
    event_id: string;
    student_name: string;
    timestamp: string;
    within_radius: boolean;
  };
}

export interface AttendanceResponseDTO {
  id: string;
  event_id: string;
  student_id: number;
  student_name: string;
  status: string;
  timestamp: string;
  location?: Location;
  validation?: {
    within_radius: boolean;
    distance_meters: number;
  };
}

// Professor Dashboard DTOs
export interface DashboardResponseDTO {
  teacher: {
    id: number;
    full_name: string;
    email: string;
  };
  classes: Array<{
    id: number;
    name: string;
    student_count: number;
  }>;
  upcoming_events: Array<{
    id: string;
    class_name: string;
    start_time: string;
    end_time: string;
  }>;
  recent_occurrences: Array<{
    id: string;
    type: string;
    description: string;
    created_at: string;
  }>;
  stats: {
    total_events: number;
    total_attendances: number;
    total_occurrences: number;
  };
}

// Standard API Response
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    size?: number;
    total?: number;
    total_pages?: number;
  };
  message?: string;
}

// Paged response
export interface PagedResponse<T> {
  items: T[];
  meta: {
    page: number;
    size: number;
    total: number;
    total_pages: number;
  };
}
