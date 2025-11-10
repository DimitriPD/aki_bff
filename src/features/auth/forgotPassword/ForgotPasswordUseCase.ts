import { PersonasPasswordClient } from '../../_shared/auth/PersonasPasswordClient';
import { ForgotPasswordRequestDTO } from '../_types';
import logger from '../../../shared/logger';

export class ForgotPasswordUseCase {
  private personasPasswordClient: PersonasPasswordClient;

  constructor() {
    this.personasPasswordClient = new PersonasPasswordClient();
  }

  async execute(data: ForgotPasswordRequestDTO, correlationId: string): Promise<{ status: string; message: string }> {
    logger.info('Password recovery requested', { email: data.email, correlationId });

    try {
      await this.personasPasswordClient.sendForgotPasswordEmail(data.email);
      logger.info('Password recovery email sent', { email: data.email, correlationId });
    } catch (error: any) {
      logger.warn('Password recovery email failed', {
        email: data.email,
        error: error.message,
        correlationId,
      });
    }

    return {
      status: 'success',
      message: 'If your email is registered, you will receive password recovery instructions.',
    };
  }
}
