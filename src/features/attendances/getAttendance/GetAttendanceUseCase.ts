import { CoreClient } from '../../_shared/core/CoreClient';
export class GetAttendanceUseCase { private coreClient = new CoreClient(); async execute(attendanceId: string) { return this.coreClient.getAttendance(attendanceId); } }
