import { HttpClient } from '../HttpClient';
import { config } from '../../config';

export class PersonasPasswordClient {
  private http: any;

  constructor() {
    // Use PersonasClient's HttpClient config
    this.http = new HttpClient({
      baseURL: config.services.personas.baseUrl,
      timeout: config.services.personas.timeout,
      maxRetries: config.http.maxRetries,
      retryDelay: config.http.retryDelay,
    });
  }

  async sendForgotPasswordEmail(teacher_email: string): Promise<any> {
    return this.http.post('/teachers/recover-password', { teacher_email });
  }
}
