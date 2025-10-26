import { CoreClient } from '../../../infrastructure/http/clients/CoreClient';
import { Event } from '../../../domain/entities';
import { PagedResponse } from '../../../domain/dto';

interface GetEventsParams {
  page?: number;
  size?: number;
  class_id?: number;
  teacher_id?: number;
  status?: string;
}

export class GetEventsUseCase {
  private coreClient: CoreClient;

  constructor() {
    this.coreClient = new CoreClient();
  }

  async execute(
    params: GetEventsParams,
    correlationId: string,
  ): Promise<PagedResponse<Event>> {
    // Fetch events from Core microservice
    const result = await this.coreClient.getEvents(params);
    return result;
  }
}
