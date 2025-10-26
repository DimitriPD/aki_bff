import { PersonasClient, CoreClient } from '../../../infrastructure/http/clients';
import { ScanQRRequestDTO, ScanQRResponseDTO } from '../../../domain/dto';
import logger from '../../../shared/logger';

export class ScanQRUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;

  constructor() {
    this.personasClient = new PersonasClient();
    this.coreClient = new CoreClient();
  }

  async execute(data: ScanQRRequestDTO, correlationId: string): Promise<ScanQRResponseDTO> {
    logger.info('QR scan initiated', { deviceId: data.device_id, correlationId });

    try {
      // Step 1: Try to resolve student from device or CPF (optional for enrichment)
      let student = null;
      let studentName = 'Student'; // Default if not found
      
      try {
        // Try to get student by device first
        student = await this.personasClient.getStudentByDevice(data.device_id);
        studentName = student.full_name;
      } catch (error: any) {
        if (error.statusCode === 404) {
          // Device not bound - try CPF if provided
          if (data.student_cpf) {
            try {
              student = await this.personasClient.getStudentByCPF(data.student_cpf);
              studentName = student.full_name;

              // Try to bind device (best effort)
              try {
                await this.personasClient.bindDevice(student.id, data.device_id);
                logger.info('Device auto-bound during scan', { studentId: student.id, correlationId });
              } catch (bindError: any) {
                logger.warn('Could not bind device, but continuing', { error: bindError.message });
              }
            } catch (studentError: any) {
              // Student not found in Personas - Core will validate
              logger.info('Student not found in Personas, Core will validate', { 
                cpf: data.student_cpf, 
                correlationId 
              });
            }
          }
        } else {
          logger.warn('Error fetching student from Personas', { error: error.message });
        }
      }

      // Step 2: Register attendance via Core microservice
      // Core will validate the student and event independently
      const attendanceData = {
        qr_token: data.qr_token,
        device_id: data.device_id,
        student_cpf: data.student_cpf,
        location: data.location,
      };

      const attendance = await this.coreClient.createAttendance(attendanceData);

      logger.info('Attendance registered successfully', {
        attendanceId: attendance.id,
        studentId: attendance.student_id,
        correlationId,
      });

      // Step 3: Format response
      const withinRadius = attendance.validation?.within_radius ?? true;
      const statusMessage = withinRadius
        ? 'Attendance registered successfully!'
        : 'Attendance registered, but you are outside the expected location radius.';

      return {
        status: 'success',
        message: statusMessage,
        attendance: {
          id: attendance.id,
          event_id: attendance.event_id,
          student_name: studentName,
          timestamp: attendance.timestamp,
          within_radius: withinRadius,
        },
      };
    } catch (error: any) {
      logger.error('QR scan failed', {
        error: error.message,
        deviceId: data.device_id,
        correlationId,
      });

      // Return user-friendly error response
      return {
        status: 'error',
        message: error.message || 'Failed to register attendance. Please try again.',
      };
    }
  }
}
