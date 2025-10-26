export interface Location {
  latitude: number;
  longitude: number;
}

export interface Student {
  id: number;
  cpf: string;
  full_name: string;
  device_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Teacher {
  id: number;
  cpf: string;
  full_name: string;
  email: string;
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Class {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClassWithMembers {
  id: number;
  name: string;
  students: Student[];
  teachers: Teacher[];
  created_at?: string;
  updated_at?: string;
}

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

export type AttendanceStatus = 'recorded' | 'manual' | 'retroactive' | 'invalid';

export interface Attendance {
  id: string;
  event_id: string;
  student_id: number;
  status: AttendanceStatus;
  timestamp: string;
  location?: Location;
  validation?: {
    within_radius: boolean;
    distance_meters: number;
  };
  created_by?: string;
  created_at?: string;
}

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
