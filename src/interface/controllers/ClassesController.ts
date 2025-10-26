import { Request, Response } from 'express';
import { PersonasClient } from '../../infrastructure/http/clients/PersonasClient';

export class ClassesController {
  private personasClient: PersonasClient;

  constructor() {
    this.personasClient = new PersonasClient();
  }

  getClasses = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, size } = req.query;
      
      const params: { page?: number; size?: number } = {};
      if (page) params.page = parseInt(page as string);
      if (size) params.size = parseInt(size as string);

      const result = await this.personasClient.getClasses(params);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  getClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const classData = await this.personasClient.getClassWithMembers(parseInt(id));
      res.json(classData);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  createClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({
          code: 'validation_error',
          message: 'name is required',
          details: ['name must be provided'],
        });
        return;
      }

      const classData = await this.personasClient.createClass({ name });
      res.status(201).json(classData);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  updateClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const data: { name?: string } = {};
      if (name !== undefined) data.name = name;

      const classData = await this.personasClient.updateClass(parseInt(id), data);
      res.json(classData);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  deleteClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.personasClient.deleteClass(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  getClassStudents = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const students = await this.personasClient.getClassStudents(parseInt(id));
      res.json(students);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  addStudentToClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { student_id } = req.body;

      if (!student_id) {
        res.status(400).json({
          code: 'validation_error',
          message: 'student_id is required',
          details: ['student_id must be provided in request body'],
        });
        return;
      }

      const classData = await this.personasClient.addStudentToClass(
        parseInt(id),
        parseInt(student_id)
      );
      res.status(201).json(classData);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  removeStudentFromClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, studentId } = req.params;
      await this.personasClient.removeStudentFromClass(parseInt(id), parseInt(studentId));
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };

  removeTeacherFromClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, teacherId } = req.params;
      await this.personasClient.removeTeacherFromClass(parseInt(id), parseInt(teacherId));
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        code: error.code || 'internal_error',
        message: error.message || 'Internal server error',
        details: error.details || [],
      });
    }
  };
}
