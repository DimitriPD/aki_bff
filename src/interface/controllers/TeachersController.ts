import { Request, Response } from 'express';
import { PersonasClient } from '../../infrastructure/http/clients/PersonasClient';
import { GetTeacherDashboardUseCase } from '../../application/use-cases/teachers/GetTeacherDashboardUseCase';

export class TeachersController {
  private personasClient: PersonasClient;
  private getTeacherDashboardUseCase: GetTeacherDashboardUseCase;

  constructor() {
    this.personasClient = new PersonasClient();
    this.getTeacherDashboardUseCase = new GetTeacherDashboardUseCase();
  }

  getTeachers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, size } = req.query;
      
      const params: { page?: number; size?: number } = {};
      if (page) params.page = parseInt(page as string);
      if (size) params.size = parseInt(size as string);

      const result = await this.personasClient.getTeachers(params);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  getTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
      
      // Use aggregated use case for rich teacher dashboard
      const teacherDashboard = await this.getTeacherDashboardUseCase.execute(parseInt(id), correlationId);
      res.json(teacherDashboard);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  createTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cpf, full_name, email, password_hash } = req.body;

      if (!cpf || !full_name || !email) {
        res.status(400).json({
          code: 'validation_error',
          message: 'CPF, full_name and email are required',
          details: ['cpf, full_name and email must be provided'],
        });
        return;
      }

      const data: { cpf: string; full_name: string; email: string; password_hash?: string } = {
        cpf,
        full_name,
        email,
      };
      if (password_hash !== undefined) data.password_hash = password_hash;

      const teacher = await this.personasClient.createTeacher(data);
      res.status(201).json(teacher);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  updateTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { full_name, email, password_hash } = req.body;

      const data: { full_name?: string; email?: string; password_hash?: string } = {};
      if (full_name !== undefined) data.full_name = full_name;
      if (email !== undefined) data.email = email;
      if (password_hash !== undefined) data.password_hash = password_hash;

      const teacher = await this.personasClient.updateTeacher(parseInt(id), data);
      res.json(teacher);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  deleteTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.personasClient.deleteTeacher(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  recoverPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teacher_email } = req.body;

      if (!teacher_email) {
        res.status(400).json({
          code: 'validation_error',
          message: 'teacher_email is required',
          details: ['teacher_email must be provided in request body'],
        });
        return;
      }

      const result = await this.personasClient.recoverPassword(teacher_email);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };
}
