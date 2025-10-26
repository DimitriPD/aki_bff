import { CoreClient } from '../../../infrastructure/http/clients/CoreClient';
import { AttendanceResponseDTO, PagedResponse } from '../../../domain/dto';

interface GetAttendancesParams {
  event_id?: string;
  student_id?: number;
  page?: number;
  size?: number;
}

export class GetAttendancesUseCase {
  private coreClient: CoreClient;

  constructor() {
    this.coreClient = new CoreClient();
  }

  async execute(
    params: GetAttendancesParams,
    correlationId: string,
  ): Promise<PagedResponse<AttendanceResponseDTO>> {
    const { event_id, student_id } = params;

    // Fetch attendances from Core microservice
    // Core already returns paginated data
    const result = await this.coreClient.getAttendances({
      event_id,
      student_id,
    });

    // Return as-is (Core service should return full AttendanceResponseDTO)
    return result as PagedResponse<AttendanceResponseDTO>;
  }
}
