import jwt from 'jsonwebtoken';
import { config } from '../../../infrastructure/config';
import { PersonasClient } from '../../../infrastructure/http/clients';
import { LoginRequestDTO, LoginResponseDTO } from '../../../domain/dto';
import { InvalidCredentialsError } from '../../../shared/errors';
import logger from '../../../shared/logger';

export class LoginUseCase {
  private personasClient: PersonasClient;

  constructor() {
    this.personasClient = new PersonasClient();
  }

  async execute(data: LoginRequestDTO, correlationId: string): Promise<LoginResponseDTO> {
    logger.info('Login attempt', { email: data.email, correlationId });

    // For MVP: Mock authentication
    // In production, validate against Personas service with password hash
    if (config.mock.authEnabled) {
      logger.warn('Using mock authentication', { correlationId });
      
      const mockTeacher = {
        id: config.mock.teacherId,
        full_name: 'Mock Teacher',
        email: data.email,
      };

      const token = jwt.sign(
        { teacherId: mockTeacher.id, email: mockTeacher.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions,
      );

      return {
        token,
        teacher: mockTeacher,
      };
    }

    try {
      // Real authentication flow using Personas /teachers/login endpoint
      const response = await this.personasClient.loginTeacher(data.email, data.password);
      const teacher = response.data;

      // Generate JWT token
      const token = jwt.sign(
        { teacherId: teacher.id, email: teacher.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions,
      );

      logger.info('Login successful', { teacherId: teacher.id, correlationId });

      return {
        token,
        teacher: {
          id: teacher.id,
          full_name: teacher.full_name,
          email: teacher.email,
        },
      };
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new InvalidCredentialsError('Invalid credentials', undefined, correlationId);
      }
      throw error;
    }
  }
}
