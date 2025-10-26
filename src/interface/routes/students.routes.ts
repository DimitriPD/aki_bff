import { Router } from 'express';
import { StudentsController } from '../controllers/StudentsController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const studentsController = new StudentsController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /students - List students (paged)
router.get('/', studentsController.getStudents);

// GET /students/device - Get student by device id
router.get('/device', studentsController.getStudentByDevice);

// POST /students - Create a new student
router.post('/', studentsController.createStudent);

// GET /students/:id - Get student by id
router.get('/:id', studentsController.getStudent);

// PUT /students/:id - Update student
router.put('/:id', studentsController.updateStudent);

// DELETE /students/:id - Delete student
router.delete('/:id', studentsController.deleteStudent);

// PUT /students/device - Bind device to student
router.put('/device', studentsController.bindDevice);

export default router;
