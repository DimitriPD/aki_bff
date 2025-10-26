import { PersonasClient, CoreClient } from '../../../infrastructure/http/clients';
import logger from '../../../shared/logger';

/**
 * Aggregated use case for teacher dashboard
 * Combines data from Personas (teacher, classes) and Core (events, attendances, occurrences)
 */
export class GetTeacherDashboardUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;

  constructor() {
    this.personasClient = new PersonasClient();
    this.coreClient = new CoreClient();
  }

  async execute(teacherId: number, correlationId: string) {
    logger.info('Fetching aggregated teacher dashboard', { teacherId, correlationId });

    try {
      // Fetch teacher and their classes from Personas
      const [teacher, classesResponse] = await Promise.all([
        this.personasClient.getTeacher(teacherId),
        this.personasClient.getTeacherClasses(teacherId),
      ]);

      const classes = (classesResponse.data?.items || []).map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        student_count: cls.students?.length || 0,
      }));

      // Fetch upcoming events and recent events from Core
      const [upcomingEvents, recentEvents, allEvents] = await Promise.all([
        this.coreClient.getEvents({
          teacher_id: teacherId,
          status: 'scheduled',
          page: 1,
          size: 5,
        }).catch(() => ({ items: [], meta: { total: 0, page: 1, size: 5 } })),
        this.coreClient.getEvents({
          teacher_id: teacherId,
          status: 'closed',
          page: 1,
          size: 5,
        }).catch(() => ({ items: [], meta: { total: 0, page: 1, size: 5 } })),
        this.coreClient.getEvents({
          teacher_id: teacherId,
          page: 1,
          size: 1,
        }).catch(() => ({ items: [], meta: { total: 0, page: 1, size: 1 } })),
      ]);

      // Fetch recent occurrences from Core
      const occurrences = await this.coreClient.getOccurrences({
        teacher_id: teacherId,
        page: 1,
        size: 5,
      }).catch(() => ({ items: [], meta: { total: 0, page: 1, size: 5 } }));

      // Get attendance statistics
      let totalAttendances = 0;
      if (recentEvents.items.length > 0) {
        const attendanceCounts = await Promise.all(
          recentEvents.items.map(async (event: any) => {
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
        totalAttendances = attendanceCounts.reduce((sum, count) => sum + count, 0);
      }

      // Enrich upcoming events with class names
      const enrichedUpcomingEvents = await Promise.all(
        upcomingEvents.items.map(async (event: any) => {
          try {
            const classInfo = await this.personasClient.getClass(event.class_id);
            return {
              id: event.id,
              class_id: event.class_id,
              class_name: classInfo.name,
              start_time: event.start_time,
              end_time: event.end_time,
              status: event.status,
              location: event.location,
            };
          } catch {
            return {
              id: event.id,
              class_id: event.class_id,
              class_name: 'Unknown',
              start_time: event.start_time,
              end_time: event.end_time,
              status: event.status,
              location: event.location,
            };
          }
        })
      );

      // Enrich recent occurrences
      const enrichedOccurrences = occurrences.items.map((occ: any) => ({
        id: occ.id,
        type: occ.type,
        class_id: occ.class_id,
        student_cpf: occ.student_cpf,
        description: occ.description,
        created_at: occ.created_at,
      }));

      logger.info('Teacher dashboard aggregated successfully', { teacherId, correlationId });

      return {
        teacher: {
          id: teacher.id,
          full_name: teacher.full_name,
          email: teacher.email,
        },
        classes,
        upcoming_events: enrichedUpcomingEvents,
        recent_occurrences: enrichedOccurrences,
        stats: {
          total_classes: classes.length,
          total_events: allEvents.meta?.total || 0,
          total_attendances: totalAttendances,
          total_occurrences: occurrences.meta?.total || 0,
        },
      };
    } catch (error: any) {
      logger.error('Failed to fetch teacher dashboard', {
        teacherId,
        error: error.message,
        correlationId,
      });
      throw error;
    }
  }
}
