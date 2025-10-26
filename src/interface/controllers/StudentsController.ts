import { Request, Response } from 'express';
import { PersonasClient } from '../../infrastructure/http/clients/PersonasClient';
import { GetStudentProfileUseCase } from '../../application/use-cases/students/GetStudentProfileUseCase';

export class StudentsController {
  private personasClient: PersonasClient;
  private getStudentProfileUseCase: GetStudentProfileUseCase;

  constructor() {
    this.personasClient = new PersonasClient();
    this.getStudentProfileUseCase = new GetStudentProfileUseCase();
  }

  getStudents = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, size, q } = req.query;
      
      const params: { page?: number; size?: number; q?: string } = {};
      if (page) params.page = parseInt(page as string);
      if (size) params.size = parseInt(size as string);
      if (q) params.q = q as string;

      const result = await this.personasClient.getStudents(params);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  getStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const correlationId = req.header('x-correlation-id') || 'no-correlation-id';
      
      // Use aggregated use case for rich student profile
      const studentProfile = await this.getStudentProfileUseCase.execute(parseInt(id), correlationId);
      res.json(studentProfile);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  createStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cpf, full_name } = req.body;

      if (!cpf || !full_name) {
        res.status(400).json({
          code: 'validation_error',
          message: 'CPF and full_name are required',
          details: ['cpf and full_name must be provided'],
        });
        return;
      }

      const student = await this.personasClient.createStudent({ cpf, full_name });
      res.status(201).json(student);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  updateStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { full_name, device_id } = req.body;

      const data: { full_name?: string; device_id?: string } = {};
      if (full_name !== undefined) data.full_name = full_name;
      if (device_id !== undefined) data.device_id = device_id;

      const student = await this.personasClient.updateStudent(parseInt(id), data);
      res.json(student);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  deleteStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.personasClient.deleteStudent(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  getStudentByDevice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { device_id } = req.query;

      if (!device_id) {
        res.status(400).json({
          code: 'validation_error',
          message: 'device_id is required',
          details: ['device_id query parameter must be provided'],
        });
        return;
      }

      const student = await this.personasClient.getStudentByDevice(device_id as string);
      res.json(student);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  bindDevice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.query;
      const { device_id } = req.body;

      if (!studentId) {
        res.status(400).json({
          code: 'validation_error',
          message: 'studentId is required',
          details: ['studentId query parameter must be provided'],
        });
        return;
      }

      if (!device_id) {
        res.status(400).json({
          code: 'validation_error',
          message: 'device_id is required',
          details: ['device_id must be provided in request body'],
        });
        return;
      }

      const student = await this.personasClient.bindDevice(
        parseInt(studentId as string),
        device_id
      );
      res.json(student);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };
}
