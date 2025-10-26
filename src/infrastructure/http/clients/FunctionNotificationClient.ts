import { HttpClient } from '../HttpClient';
import { config } from '../../config';
import { IFunctionNotificationClient } from '../../../domain/interfaces';

export class FunctionNotificationClient implements IFunctionNotificationClient {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient({
      baseURL: config.services.functionNotification.baseUrl,
      timeout: config.services.functionNotification.timeout,
      maxRetries: config.http.maxRetries,
      retryDelay: config.http.retryDelay,
    });
  }

  async sendNotification(data: {
    class_id: number;
    teacher_id: number;
    message: string;
  }): Promise<{ status: string; notification_id: number }> {
    return this.http.post<{ status: string; notification_id: number }>(
      '/api/notification',
      data,
    );
  }
}
