import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { CoreClient } from '../../_shared/core/CoreClient';
import { CreateEventRequestDTO, EventResponseDTO } from '../_types';
import logger from '../../../shared/logger';

export class CreateEventUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;
  constructor() { this.personasClient = new PersonasClient(); this.coreClient = new CoreClient(); }
  async execute(data: CreateEventRequestDTO, correlationId: string): Promise<EventResponseDTO> {
    logger.info('Creating event', { classId: data.class_id, correlationId });
    const event = await this.coreClient.createEvent(data);
    const [classInfo, teacher] = await Promise.all([
      this.personasClient.getClass(data.class_id),
      this.personasClient.getTeacher(data.teacher_id),
    ]);
    logger.info('Event created successfully', { eventId: event.id, correlationId });
    return {
      id: event.id,
      class_id: event.class_id,
      class_name: classInfo.name,
      teacher_id: event.teacher_id,
      teacher_name: teacher.full_name,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      qr_token: event.qr_token,
      status: event.status,
      created_at: event.created_at || new Date().toISOString(),
      updated_at: event.updated_at || new Date().toISOString(),
    };
  }
}
