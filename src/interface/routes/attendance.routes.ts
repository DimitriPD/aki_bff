import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const attendanceController = new AttendanceController();

/**
 * @route GET /attendances
 * @desc Get attendances by event or student
 * @access Protected
 */
router.get('/', authMiddleware, (req, res, next) =>
  attendanceController.getAttendances(req, res, next),
);

/**
 * @route GET /attendances/:attendanceId
 * @desc Get attendance by ID
 * @access Protected
 */
router.get('/:attendanceId', authMiddleware, (req, res, next) =>
  attendanceController.getAttendance(req, res, next),
);

/**
 * @route PUT /attendances/:attendanceId
 * @desc Update attendance
 * @access Protected
 */
router.put('/:attendanceId', authMiddleware, (req, res, next) =>
  attendanceController.updateAttendance(req, res, next),
);

export default router;
