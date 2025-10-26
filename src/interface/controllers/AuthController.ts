import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { ForgotPasswordUseCase } from '../../application/use-cases/auth/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../application/use-cases/auth/ResetPasswordUseCase';
import { ApiResponse } from '../../domain/dto';

export class AuthController {
  private loginUseCase: LoginUseCase;
  private forgotPasswordUseCase: ForgotPasswordUseCase;
  private resetPasswordUseCase: ResetPasswordUseCase;

  constructor() {
    this.loginUseCase = new LoginUseCase();
    this.forgotPasswordUseCase = new ForgotPasswordUseCase();
    this.resetPasswordUseCase = new ResetPasswordUseCase();
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const result = await this.loginUseCase.execute(req.body, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Login successful',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const result = await this.forgotPasswordUseCase.execute(req.body, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Password recovery email sent',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.header('x-correlation-id') as string;
      const result = await this.resetPasswordUseCase.execute(req.body, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Password reset successful',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
