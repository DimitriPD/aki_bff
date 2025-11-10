import { Event } from '../../events/_types';
import { Attendance } from '../../attendances/_types';

export interface ICoreClient {
  createEvent(data: any): Promise<Event>;
  getEvents(filters: any): Promise<{ items: Event[]; meta: any }>;
  getEvent(id: string): Promise<Event>;
  updateEvent(id: string, data: any): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  getEventQR(id: string): Promise<any>;
  createAttendance(data: any): Promise<Attendance>;
  getAttendances(filters: any): Promise<{ items: Attendance[]; meta: any }>;
  getAttendance(id: string): Promise<Attendance>;
  updateAttendance(id: string, data: any): Promise<Attendance>;
  getOccurrences(filters: any): Promise<{ items: any[]; meta: any }>;
  createOccurrence(data: any): Promise<any>;
}
