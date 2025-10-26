import { PersonasClient, CoreClient } from '../../../infrastructure/http/clients';
import { CreateEventRequestDTO, EventResponseDTO } from '../../../domain/dto';
import logger from '../../../shared/logger';

export class CreateEventUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;

  constructor() {
    this.personasClient = new PersonasClient();
    this.coreClient = new CoreClient();
  }

  async execute(data: CreateEventRequestDTO, correlationId: string): Promise<EventResponseDTO> {
    logger.info('Creating event', { classId: data.class_id, correlationId });

    // Create event in Core microservice
    const event = await this.coreClient.createEvent(data);

    // Enrich with class and teacher names from Personas
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
