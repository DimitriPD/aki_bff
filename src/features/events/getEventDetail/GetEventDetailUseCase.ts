import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { CoreClient } from '../../_shared/core/CoreClient';
import logger from '../../../shared/logger';

export class GetEventDetailUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;
  constructor() { this.personasClient = new PersonasClient(); this.coreClient = new CoreClient(); }
  async execute(eventId: string, correlationId: string) {
    logger.info('Fetching aggregated event details', { eventId, correlationId });
    try {
      const event = await this.coreClient.getEvent(eventId);
      const attendances = await this.coreClient.getAttendances({ event_id: eventId, page: 1, size: 100 })
        .catch(() => ({ items: [], meta: { total: 0, page: 1, size: 100 } }));
      const [classInfo, teacher] = await Promise.all([
        this.personasClient.getClass(event.class_id),
        this.personasClient.getTeacher(event.teacher_id),
      ]);
      const classStudents = await this.personasClient.getClassStudents(event.class_id);
      const enrichedAttendances = await Promise.all(attendances.items.map(async (att: any) => {
        const student = classStudents.find((s: any) => s.id === att.student_id);
        return {
          id: att.id,
          student_id: att.student_id,
          student_name: student?.full_name || 'Unknown',
          student_cpf: student?.cpf || '',
          timestamp: att.timestamp,
          status: att.status,
          location: att.location,
          within_radius: att.validation?.within_radius,
        };
      }));
      const totalStudents = classStudents.length;
      const totalAttendances = attendances.meta?.total || 0;
      const attendanceRate = totalStudents > 0 ? Math.round((totalAttendances / totalStudents) * 100) : 0;
      const onTimeAttendances = enrichedAttendances.filter(att => att.within_radius !== false).length;
      const attendedStudentIds = new Set(enrichedAttendances.map(att => att.student_id));
      const absentStudents = classStudents.filter((s: any) => !attendedStudentIds.has(s.id)).map((s: any) => ({
        id: s.id, cpf: s.cpf, full_name: s.full_name,
      }));
      logger.info('Event details aggregated successfully', { eventId, correlationId });
      return {
        event: {
          id: event.id,
          class_id: event.class_id,
          class_name: classInfo.name,
          teacher_id: event.teacher_id,
          teacher_name: teacher.full_name,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          status: event.status,
          qr_token: event.qr_token,
        },
        attendances: enrichedAttendances,
        absent_students: absentStudents,
        stats: {
          total_students: totalStudents,
          total_attendances: totalAttendances,
          attendance_rate: attendanceRate,
          on_time_attendances: onTimeAttendances,
          absent_count: absentStudents.length,
        },
      };
    } catch (error: any) {
      logger.error('Failed to fetch event details', { eventId, error: error.message, correlationId });
      throw error;
    }
  }
}
