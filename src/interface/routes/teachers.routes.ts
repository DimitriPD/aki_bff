import { Router } from 'express';
import { TeachersController } from '../controllers/TeachersController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const teachersController = new TeachersController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /teachers - List teachers (paged)
router.get('/', teachersController.getTeachers);

// POST /teachers - Create a new teacher
router.post('/', teachersController.createTeacher);

// POST /teachers/recover-password - Send password recovery email
router.post('/recover-password', teachersController.recoverPassword);

// GET /teachers/:id - Get teacher by id
router.get('/:id', teachersController.getTeacher);

// PUT /teachers/:id - Update teacher
router.put('/:id', teachersController.updateTeacher);

// DELETE /teachers/:id - Delete teacher
router.delete('/:id', teachersController.deleteTeacher);

export default router;
