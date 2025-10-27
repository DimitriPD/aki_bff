import { PersonasPasswordClient } from '../../../infrastructure/http/clients/PersonasPasswordClient';
import { ForgotPasswordRequestDTO } from '../../../domain/dto';
import logger from '../../../shared/logger';

export class ForgotPasswordUseCase {
  private personasPasswordClient: PersonasPasswordClient;

  constructor() {
    this.personasPasswordClient = new PersonasPasswordClient();
  }

  async execute(data: ForgotPasswordRequestDTO, correlationId: string): Promise<{ status: string; message: string }> {
    logger.info('Password recovery requested', { email: data.email, correlationId });

    try {
      // Forward to Personas microservice for password recovery
      await this.personasPasswordClient.sendForgotPasswordEmail(data.email);

      logger.info('Password recovery email sent', { email: data.email, correlationId });

      return {
        status: 'success',
        message: 'If your email is registered, you will receive password recovery instructions.',
      };
    } catch (error: any) {
      // For security, always return success even if email not found
      logger.warn('Password recovery email failed', {
        email: data.email,
        error: error.message,
        correlationId,
      });

      return {
        status: 'success',
        message: 'If your email is registered, you will receive password recovery instructions.',
      };
    }
  }
}
