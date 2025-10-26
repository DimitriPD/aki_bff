import { PersonasClient, CoreClient } from '../../../infrastructure/http/clients';
import logger from '../../../shared/logger';

/**
 * Aggregated use case for student profile
 * Combines data from Personas (student info, classes) and Core (attendance history)
 */
export class GetStudentProfileUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;

  constructor() {
    this.personasClient = new PersonasClient();
    this.coreClient = new CoreClient();
  }

  async execute(studentId: number, correlationId: string) {
    logger.info('Fetching aggregated student profile', { studentId, correlationId });

    try {
      // Fetch student from Personas
      const student = await this.personasClient.getStudent(studentId);

      // Fetch all classes to find which ones the student belongs to
      const allClasses = await this.personasClient.getClasses({ page: 1, size: 100 });
      
      // Filter classes that contain this student
      const studentClasses = await Promise.all(
        allClasses.items.map(async (cls: any) => {
          try {
            const classStudents = await this.personasClient.getClassStudents(cls.id);
            const isEnrolled = classStudents.some((s: any) => s.id === studentId);
            
            if (isEnrolled) {
              return {
                id: cls.id,
                name: cls.name,
              };
            }
            return null;
          } catch {
            return null;
          }
        })
      );

      const enrolledClasses = studentClasses.filter((cls) => cls !== null);

      // Fetch recent attendances from Core
      const attendances = await this.coreClient.getAttendances({
        student_id: studentId,
        page: 1,
        size: 10,
      }).catch(() => ({ items: [], meta: { total: 0, page: 1, size: 10 } }));

      // Calculate attendance statistics
      const totalAttendances = attendances.meta?.total || 0;
      
      // Get events for enrolled classes to calculate attendance rate
      let totalExpectedAttendances = 0;
      for (const cls of enrolledClasses) {
        if (cls) {
          const classEvents = await this.coreClient.getEvents({
            class_id: cls.id,
            status: 'closed',
            page: 1,
            size: 1,
          }).catch(() => ({ meta: { total: 0 } }));
          totalExpectedAttendances += classEvents.meta?.total || 0;
        }
      }

      const attendanceRate = totalExpectedAttendances > 0
        ? Math.round((totalAttendances / totalExpectedAttendances) * 100)
        : 0;

      logger.info('Student profile aggregated successfully', { studentId, correlationId });

      return {
        student: {
          id: student.id,
          cpf: student.cpf,
          full_name: student.full_name,
          device_id: student.device_id,
          created_at: student.created_at,
        },
        enrolled_classes: enrolledClasses,
        recent_attendances: attendances.items.map((att: any) => ({
          id: att.id,
          event_id: att.event_id,
          timestamp: att.timestamp,
          status: att.status,
        })),
        stats: {
          total_classes: enrolledClasses.length,
          total_attendances: totalAttendances,
          attendance_rate: attendanceRate,
        },
      };
    } catch (error: any) {
      logger.error('Failed to fetch student profile', {
        studentId,
        error: error.message,
        correlationId,
      });
      throw error;
    }
  }
}
