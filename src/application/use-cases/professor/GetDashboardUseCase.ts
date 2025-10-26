import { PersonasClient, CoreClient } from '../../../infrastructure/http/clients';
import { DashboardResponseDTO } from '../../../domain/dto';
import logger from '../../../shared/logger';

export class GetDashboardUseCase {
  private personasClient: PersonasClient;
  // private coreClient: CoreClient; // TODO: Use for fetching events/occurrences

  constructor() {
    this.personasClient = new PersonasClient();
    // this.coreClient = new CoreClient();
  }

  async execute(teacherId: number, correlationId: string): Promise<DashboardResponseDTO> {
    logger.info('Fetching dashboard data', { teacherId, correlationId });

    try {
      // Fetch teacher data and classes in parallel
      const [teacher, classesResponse] = await Promise.all([
        this.personasClient.getTeacher(teacherId),
        this.personasClient.getTeacherClasses(teacherId),
      ]);

      // Extract classes from response
      const classes = (classesResponse.data?.items || []).map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        student_count: cls.students?.length || 0,
      }));

      // Mock upcoming events and occurrences for now
      // In production, fetch from Core microservice
      const upcomingEvents: any[] = [];
      const recentOccurrences: any[] = [];

      const stats = {
        total_events: 0,
        total_attendances: 0,
        total_occurrences: 0,
      };

      logger.info('Dashboard data fetched successfully', { teacherId, correlationId });

      return {
        teacher: {
          id: teacher.id,
          full_name: teacher.full_name,
          email: teacher.email,
        },
        classes,
        upcoming_events: upcomingEvents,
        recent_occurrences: recentOccurrences,
        stats,
      };
    } catch (error: any) {
      logger.error('Failed to fetch dashboard data', {
        teacherId,
        error: error.message,
        correlationId,
      });
      throw error;
    }
  }
}
