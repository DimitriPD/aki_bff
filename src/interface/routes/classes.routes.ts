import { Router } from 'express';
import { ClassesController } from '../controllers/ClassesController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const classesController = new ClassesController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /classes - List classes (paged)
router.get('/', classesController.getClasses);

// POST /classes - Create a new class
router.post('/', classesController.createClass);

// GET /classes/:id - Get class by id (with members)
router.get('/:id', classesController.getClass);

// PUT /classes/:id - Update class
router.put('/:id', classesController.updateClass);

// DELETE /classes/:id - Delete class
router.delete('/:id', classesController.deleteClass);

// GET /classes/:id/students - List students in a class
router.get('/:id/students', classesController.getClassStudents);

// POST /classes/:id/students - Add a student to a class
router.post('/:id/students', classesController.addStudentToClass);

// DELETE /classes/:id/students/:studentId - Remove a student from class
router.delete('/:id/students/:studentId', classesController.removeStudentFromClass);

// DELETE /classes/:id/teachers/:teacherId - Remove a teacher from class
router.delete('/:id/teachers/:teacherId', classesController.removeTeacherFromClass);

export default router;
