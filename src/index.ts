import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { config } from './infrastructure/config';
import { errorHandler } from './shared/errors';
import { correlationIdMiddleware, requestLogger } from './interface/middlewares';
import authRoutes from './interface/routes/auth.routes';
import studentRoutes from './interface/routes/student.routes';
import professorRoutes from './interface/routes/professor.routes';
import attendanceRoutes from './interface/routes/attendance.routes';
import eventRoutes from './interface/routes/event.routes';
import occurrenceRoutes from './interface/routes/occurrence.routes';
import scanRoutes from './interface/routes/scan.routes';
import studentsRoutes from './interface/routes/students.routes';
import teachersRoutes from './interface/routes/teachers.routes';
import classesRoutes from './interface/routes/classes.routes';
import logger from './shared/logger';

// Load environment variables
dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    // Security and CORS
    this.app.use(
      helmet({
        contentSecurityPolicy: false, // Disable for Swagger UI
      }),
    );
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: true,
      }),
    );

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Custom middlewares
    this.app.use(correlationIdMiddleware);
    this.app.use(requestLogger);
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'aki-bff',
        version: '1.0.0',
      });
    });

    // Swagger Documentation
    try {
      const swaggerPath = path.resolve(process.cwd(), 'docs/AKI! - BFF (Backend For Frontend) - Swagger.yaml');
      const swaggerDocument = YAML.load(swaggerPath);
      
      this.app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
          customCss: '.swagger-ui .topbar { display: none }',
          customSiteTitle: 'AKI! BFF API Documentation',
          customfavIcon: '/favicon.ico',
        }),
      );

      logger.info('📚 Swagger documentation available at /docs');
    } catch (error) {
      logger.error('Failed to load Swagger documentation', { error });
    }

    // API v1 routes
    const apiV1 = express.Router();

    apiV1.use('/auth', authRoutes);
    apiV1.use('/student', studentRoutes);
    apiV1.use('/professor', professorRoutes);
    apiV1.use('/attendances', attendanceRoutes);
    apiV1.use('/events', eventRoutes);
    apiV1.use('/occurrences', occurrenceRoutes);
    
    // Personas endpoints
    apiV1.use('/students', studentsRoutes);
    apiV1.use('/teachers', teachersRoutes);
    apiV1.use('/classes', classesRoutes);
    
    // Public scan endpoint (no authentication)
    apiV1.use('/scan', scanRoutes);

    this.app.use('/v1', apiV1);

    // 404 handler
    this.app.use((_req: Request, res: Response) => {
      res.status(404).json({
        code: 'not_found',
        message: 'Endpoint not found',
        timestamp: new Date().toISOString(),
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    const port = config.port;

    this.app.listen(port, () => {
      logger.info(`🚀 BFF Server running on port ${port}`, {
        environment: config.nodeEnv,
        port,
      });

      logger.info('📡 Connected services:', {
        personas: config.services.personas.baseUrl,
        core: config.services.core.baseUrl,
        functionPassword: config.services.functionPassword.baseUrl,
        functionNotification: config.services.functionNotification.baseUrl,
      });

      logger.info('🔐 Authentication mode:', {
        mockEnabled: config.mock.authEnabled,
      });
    });
  }
}

// Create and start server
const app = new App();
app.listen();

export default app.app;
