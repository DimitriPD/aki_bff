import { CoreClient } from '../../_shared/core/CoreClient';
export class UpdateAttendanceUseCase { private coreClient = new CoreClient(); async execute(attendanceId: string, data: any) { return this.coreClient.updateAttendance(attendanceId, data); } }
