import { CoreClient } from '../../_shared/core/CoreClient';
import { Event, PagedResponse } from '../_types';

interface GetEventsParams {
  page?: number;
  size?: number;
  class_id?: number;
  teacher_id?: number;
  status?: string;
}

export class GetEventsUseCase {
  private coreClient: CoreClient;
  constructor() { this.coreClient = new CoreClient(); }
  async execute(params: GetEventsParams, _correlationId: string): Promise<PagedResponse<Event>> {
    return this.coreClient.getEvents(params);
  }
}
