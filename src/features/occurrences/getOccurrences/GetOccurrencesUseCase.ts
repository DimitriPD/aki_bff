import { CoreClient } from '../../_shared/core/CoreClient';
import { PagedResponse } from '../_types';

interface GetOccurrencesParams { page?: number; size?: number; class_id?: number; teacher_id?: number; }

export class GetOccurrencesUseCase {
  private coreClient = new CoreClient();
  async execute(params: GetOccurrencesParams, _correlationId: string): Promise<PagedResponse<any>> {
    return this.coreClient.getOccurrences(params);
  }
}
