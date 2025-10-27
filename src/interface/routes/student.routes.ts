
import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { validate } from '../middlewares';
import { bindDeviceSchema, scanQRSchema } from '../../application/use-cases/student';

const router = Router();
const studentController = new StudentController();

/**
 * @route POST /student/device
 * @desc Bind device to student (first-time association)
 * @access Public
 */
router.post(
  '/device',
  validate(bindDeviceSchema),
  studentController.bindDevice.bind(studentController),
);

/**
 * @route POST /student/scan
 * @desc Register attendance by scanning QR code
 * @access Public
 */
router.post('/scan', validate(scanQRSchema), studentController.scanQR.bind(studentController));

/**
 * @route POST /student/:studentId/clear-device
 * @desc Unlink device from student
 * @access Public
 */
router.post('/:studentId/clear-device', studentController.clearDevice.bind(studentController));

/**
 * @route POST /student/register-device-cpf
 * @desc Register device by CPF and record attendance
 * @access Public
 */
router.post('/register-device-cpf', studentController.registerDeviceByCPF.bind(studentController));

export default router;
