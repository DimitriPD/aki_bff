import { FunctionPasswordClient, PersonasClient } from '../../../infrastructure/http/clients';
import { ResetPasswordRequestDTO } from '../../../domain/dto';
import { TokenInvalidError } from '../../../shared/errors';
import logger from '../../../shared/logger';

export class ResetPasswordUseCase {
  private functionPasswordClient: FunctionPasswordClient;
  private personasClient: PersonasClient;

  constructor() {
    this.functionPasswordClient = new FunctionPasswordClient();
    this.personasClient = new PersonasClient();
  }

  async execute(data: ResetPasswordRequestDTO, correlationId: string): Promise<{ status: string; message: string }> {
    logger.info('Password reset attempted', { correlationId });

    try {
      // Validate token with Function
      const validation = await this.functionPasswordClient.validateResetToken(data.token);

      if (!validation.valid || !validation.teacher_email) {
        throw new TokenInvalidError('Invalid or expired reset token', undefined, correlationId);
      }

      // Get teacher by email
      const teacher = await this.personasClient.getTeacherByEmail(validation.teacher_email);

      // TODO: Hash the password properly (use bcrypt)
      // For now, storing plain text (INSECURE - for development only)
      const passwordHash = data.new_password; // Should be: await bcrypt.hash(data.new_password, 10)

      // Update teacher password
      await this.personasClient.updateTeacherPassword(teacher.id, passwordHash);

      logger.info('Password reset successful', { teacherId: teacher.id, correlationId });

      return {
        status: 'success',
        message: 'Password has been reset successfully. You can now login with your new password.',
      };
    } catch (error: any) {
      if (error instanceof TokenInvalidError) {
        throw error;
      }

      logger.error('Password reset failed', { error: error.message, correlationId });
      throw new TokenInvalidError('Failed to reset password', undefined, correlationId);
    }
  }
}
