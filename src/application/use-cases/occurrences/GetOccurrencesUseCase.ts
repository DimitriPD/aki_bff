import { CoreClient } from '../../../infrastructure/http/clients/CoreClient';
import { PagedResponse } from '../../../domain/dto';

interface GetOccurrencesParams {
  page?: number;
  size?: number;
  class_id?: number;
  teacher_id?: number;
}

export class GetOccurrencesUseCase {
  private coreClient: CoreClient;

  constructor() {
    this.coreClient = new CoreClient();
  }

  async execute(
    params: GetOccurrencesParams,
    correlationId: string,
  ): Promise<PagedResponse<any>> {
    // Fetch occurrences from Core microservice
    const result = await this.coreClient.getOccurrences(params);
    return result;
  }
}
