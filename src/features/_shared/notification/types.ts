export interface IFunctionNotificationClient {
  sendNotification(data: { class_id: number; teacher_id: number; message: string }): Promise<{ status: string; notification_id: number }>;
}
