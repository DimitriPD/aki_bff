import { CoreClient } from '../../_shared/core/CoreClient';
import { AttendanceResponseDTO, PagedResponse } from '../_types';

interface GetAttendancesParams {
  event_id?: string;
  student_id?: number;
  page?: number;
  size?: number;
}

/**
 * Vertical Slice: Get Attendances
 * Wraps CoreClient retrieval and exposes a typed response.
 */
export class GetAttendancesUseCase {
  private coreClient: CoreClient;

  constructor() {
    this.coreClient = new CoreClient();
  }

  async execute(
    params: GetAttendancesParams,
    _correlationId: string,
  ): Promise<PagedResponse<AttendanceResponseDTO>> {
    const { event_id, student_id } = params;

    const result = await this.coreClient.getAttendances({
      event_id,
      student_id,
    });

    return result as PagedResponse<AttendanceResponseDTO>;
  }
}
