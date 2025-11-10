import { PersonasClient } from '../../_shared/personas/PersonasClient';
import logger from '../../../shared/logger';
import { DashboardResponseDTO } from '../_types';

export class GetDashboardUseCase {
  private personasClient: PersonasClient;
  constructor() { this.personasClient = new PersonasClient(); }
  async execute(teacherId: number, correlationId: string): Promise<DashboardResponseDTO> {
    logger.info('Fetching dashboard data', { teacherId, correlationId });
    try {
      const [teacher, classesResponse] = await Promise.all([
        this.personasClient.getTeacher(teacherId),
        this.personasClient.getTeacherClasses(teacherId),
      ]);
      const classes = (classesResponse.data?.items || []).map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        student_count: cls.students?.length || 0,
      }));
      const upcoming_events: any[] = [];
      const recent_occurrences: any[] = [];
      const stats = { total_events: 0, total_attendances: 0, total_occurrences: 0 };
      logger.info('Dashboard data fetched successfully', { teacherId, correlationId });
      return {
        teacher: { id: teacher.id, full_name: teacher.full_name, email: teacher.email },
        classes,
        upcoming_events,
        recent_occurrences,
        stats,
      };
    } catch (error: any) {
      logger.error('Failed to fetch dashboard data', { teacherId, error: error.message, correlationId });
      throw error;
    }
  }
}
