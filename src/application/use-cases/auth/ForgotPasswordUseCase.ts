import { FunctionPasswordClient } from '../../../infrastructure/http/clients';
import { ForgotPasswordRequestDTO } from '../../../domain/dto';
import logger from '../../../shared/logger';

export class ForgotPasswordUseCase {
  private functionPasswordClient: FunctionPasswordClient;

  constructor() {
    this.functionPasswordClient = new FunctionPasswordClient();
  }

  async execute(data: ForgotPasswordRequestDTO, correlationId: string): Promise<{ status: string; message: string }> {
    logger.info('Password recovery requested', { email: data.email, correlationId });

    try {
      // Forward to Azure Function 3 (Password Recovery)
      await this.functionPasswordClient.sendForgotPasswordEmail(data.email);

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
