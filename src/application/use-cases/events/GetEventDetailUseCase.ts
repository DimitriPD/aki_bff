import { PersonasClient, CoreClient } from '../../../infrastructure/http/clients';
import logger from '../../../shared/logger';

/**
 * Aggregated use case for event details with attendances
 * Combines data from Core (event, attendances) and Personas (class, teacher, students)
 */
export class GetEventDetailUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;

  constructor() {
    this.personasClient = new PersonasClient();
    this.coreClient = new CoreClient();
  }

  async execute(eventId: string, correlationId: string) {
    logger.info('Fetching aggregated event details', { eventId, correlationId });

    try {
      // Fetch event from Core
      const event = await this.coreClient.getEvent(eventId);

      // Fetch attendances for this event
      const attendances = await this.coreClient.getAttendances({
        event_id: eventId,
        page: 1,
        size: 100,
      }).catch(() => ({ items: [], meta: { total: 0, page: 1, size: 100 } }));

      // Enrich with class and teacher info from Personas
      const [classInfo, teacher] = await Promise.all([
        this.personasClient.getClass(event.class_id),
        this.personasClient.getTeacher(event.teacher_id),
      ]);

      // Get all students in the class
      const classStudents = await this.personasClient.getClassStudents(event.class_id);

      // Enrich attendances with student names
      const enrichedAttendances = await Promise.all(
        attendances.items.map(async (att: any) => {
          try {
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
          } catch {
            return {
              id: att.id,
              student_id: att.student_id,
              student_name: 'Unknown',
              student_cpf: '',
              timestamp: att.timestamp,
              status: att.status,
              location: att.location,
              within_radius: att.validation?.within_radius,
            };
          }
        })
      );

      // Calculate statistics
      const totalStudents = classStudents.length;
      const totalAttendances = attendances.meta?.total || 0;
      const attendanceRate = totalStudents > 0
        ? Math.round((totalAttendances / totalStudents) * 100)
        : 0;

      const onTimeAttendances = enrichedAttendances.filter(
        (att) => att.within_radius !== false
      ).length;

      // List of students who didn't attend
      const attendedStudentIds = new Set(enrichedAttendances.map((att) => att.student_id));
      const absentStudents = classStudents
        .filter((student: any) => !attendedStudentIds.has(student.id))
        .map((student: any) => ({
          id: student.id,
          cpf: student.cpf,
          full_name: student.full_name,
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
      logger.error('Failed to fetch event details', {
        eventId,
        error: error.message,
        correlationId,
      });
      throw error;
    }
  }
}
