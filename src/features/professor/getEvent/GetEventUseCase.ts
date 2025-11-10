import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { CoreClient } from '../../_shared/core/CoreClient';
import { EventResponseDTO } from '../../events/_types';
import logger from '../../../shared/logger';

export class GetEventUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;
  constructor() { this.personasClient = new PersonasClient(); this.coreClient = new CoreClient(); }
  async execute(eventId: string, correlationId: string): Promise<EventResponseDTO> {
    logger.info('Fetching event', { eventId, correlationId });
    const event = await this.coreClient.getEvent(eventId);
    if (!event.class_id || !event.teacher_id) {
      logger.error('Event missing required fields', { eventId, class_id: event.class_id, teacher_id: event.teacher_id, correlationId });
      throw new Error('Event data incomplete');
    }
    const [classInfo, teacher] = await Promise.all([
      this.personasClient.getClass(event.class_id),
      this.personasClient.getTeacher(event.teacher_id),
    ]);
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
