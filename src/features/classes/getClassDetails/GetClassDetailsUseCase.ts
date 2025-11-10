import { PersonasClient } from '../../_shared/personas/PersonasClient';
import { CoreClient } from '../../_shared/core/CoreClient';
import logger from '../../../shared/logger';

export class GetClassDetailsUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;

  constructor() {
    this.personasClient = new PersonasClient();
    this.coreClient = new CoreClient();
  }

  async execute(classId: number, correlationId: string) {
    logger.info('Fetching aggregated class details', { classId, correlationId });

    try {
      const classWithMembers = await this.personasClient.getClassWithMembers(classId);

      const [recentEvents, upcomingEvents] = await Promise.all([
        this.coreClient.getEvents({
          class_id: classId,
          status: 'closed',
          page: 1,
          size: 5,
        }).catch(() => ({ items: [], meta: { total: 0, page: 1, size: 5 } })),
        this.coreClient.getEvents({
          class_id: classId,
          status: 'scheduled',
          page: 1,
          size: 5,
        }).catch(() => ({ items: [], meta: { total: 0, page: 1, size: 5 } })),
      ]);

      const totalStudents = classWithMembers.students?.length || 0;
      const totalTeachers = classWithMembers.teachers?.length || 0;
      const totalEvents = (recentEvents.meta?.total || 0) + (upcomingEvents.meta?.total || 0);

      let averageAttendance = 0;
      if (recentEvents.items.length > 0) {
        const attendanceCounts = await Promise.all(
          recentEvents.items.slice(0, 3).map(async (event: any) => {
            try {
              const attendances = await this.coreClient.getAttendances({
                event_id: event.id,
                page: 1,
                size: 1,
              });
              return attendances.meta?.total || 0;
            } catch {
              return 0;
            }
          })
        );

        const totalAttendances = attendanceCounts.reduce((sum, count) => sum + count, 0);
        averageAttendance = attendanceCounts.length > 0
          ? Math.round((totalAttendances / attendanceCounts.length / (totalStudents || 1)) * 100)
          : 0;
      }

      logger.info('Class details aggregated successfully', { classId, correlationId });

      return {
        class: {
          id: classWithMembers.id,
          name: classWithMembers.name,
          created_at: classWithMembers.created_at,
          updated_at: classWithMembers.updated_at,
        },
        students: classWithMembers.students.map((student: any) => ({
          id: student.id,
          cpf: student.cpf,
          full_name: student.full_name,
          device_id: student.device_id,
        })),
        teachers: classWithMembers.teachers.map((teacher: any) => ({
          id: teacher.id,
          full_name: teacher.full_name,
          email: teacher.email,
        })),
        recent_events: recentEvents.items.slice(0, 5).map((event: any) => ({
          id: event.id,
          start_time: event.start_time,
          end_time: event.end_time,
          status: event.status,
        })),
        upcoming_events: upcomingEvents.items.slice(0, 5).map((event: any) => ({
          id: event.id,
          start_time: event.start_time,
          end_time: event.end_time,
          status: event.status,
        })),
        stats: {
          total_students: totalStudents,
          total_teachers: totalTeachers,
          total_events: totalEvents,
          average_attendance_rate: averageAttendance,
        },
      };
    } catch (error: any) {
      logger.error('Failed to fetch class details', {
        classId,
        error: error.message,
        correlationId,
      });
      throw error;
    }
  }
}
