import { HttpClient } from '../HttpClient';
import { config } from '../../config';
import { ICoreClient } from '../../../domain/interfaces';
import { Event, Attendance } from '../../../domain/entities';
import { PagedResponse } from '../../../domain/dto';

export class CoreClient implements ICoreClient {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient({
      baseURL: config.services.core.baseUrl,
      timeout: config.services.core.timeout,
      maxRetries: config.http.maxRetries,
      retryDelay: config.http.retryDelay,
    });
  }

  async createEvent(data: any): Promise<Event> {
    const response = await this.http.post<{ data: Event }>('/events', data);
    return response.data;
  }

  async getEvents(filters: any): Promise<PagedResponse<Event>> {
    // Remove undefined/null values
    const cleanFilters: Record<string, string> = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        cleanFilters[key] = String(filters[key]);
      }
    });
    
    const queryParams = new URLSearchParams(cleanFilters).toString();
    const url = queryParams ? `/events?${queryParams}` : '/events';
    const response = await this.http.get<{ data: Event[]; meta: any }>(url);
    
    // Transform Core response format to BFF format
    return {
      items: response.data,
      meta: response.meta,
    };
  }

  async getEvent(id: string): Promise<Event> {
    const response = await this.http.get<{ data: Event }>(`/events/${id}`);
    return response.data;
  }

  async updateEvent(id: string, data: any): Promise<Event> {
    const response = await this.http.put<{ data: Event }>(`/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await this.http.delete(`/events/${id}`);
  }

  async getEventQR(id: string): Promise<any> {
    const response = await this.http.get<{ data: any }>(`/events/${id}/qr`);
    return response.data;
  }

  async createAttendance(data: any): Promise<Attendance> {
    const response = await this.http.post<{ data: Attendance }>('/attendances', data);
    return response.data;
  }

  async getAttendances(filters: any): Promise<PagedResponse<Attendance>> {
    // Remove undefined/null values
    const cleanFilters: Record<string, string> = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        cleanFilters[key] = String(filters[key]);
      }
    });
    
    const queryParams = new URLSearchParams(cleanFilters).toString();
    const url = queryParams ? `/attendances?${queryParams}` : '/attendances';
    const response = await this.http.get<{ data: Attendance[]; meta: any }>(url);
    
    // Transform Core response format to BFF format
    return {
      items: response.data,
      meta: response.meta,
    };
  }

  async getAttendance(id: string): Promise<Attendance> {
    const response = await this.http.get<{ data: Attendance }>(`/attendances/${id}`);
    return response.data;
  }

  async updateAttendance(id: string, data: any): Promise<Attendance> {
    const response = await this.http.put<{ data: Attendance }>(`/attendances/${id}`, data);
    return response.data;
  }

  async getOccurrences(filters: any): Promise<PagedResponse<any>> {
    // Remove undefined/null values
    const cleanFilters: Record<string, string> = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        cleanFilters[key] = String(filters[key]);
      }
    });
    
    const queryParams = new URLSearchParams(cleanFilters).toString();
    const url = queryParams ? `/occurrences?${queryParams}` : '/occurrences';
    const response = await this.http.get<{ data: any[]; meta: any }>(url);
    
    // Transform Core response format to BFF format
    return {
      items: response.data,
      meta: response.meta,
    };
  }

  async createOccurrence(data: any): Promise<any> {
    const response = await this.http.post<{ data: any }>('/occurrences', data);
    return response.data;
  }
}
