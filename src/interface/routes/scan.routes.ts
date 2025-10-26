import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { validate } from '../middlewares';
import { scanQRSchema } from '../../application/use-cases/student';

const router = Router();
const studentController = new StudentController();

/**
 * @route POST /scan
 * @desc Register attendance by scanning QR code
 * @access Public (no authentication required)
 */
router.post('/', validate(scanQRSchema), studentController.scanQR.bind(studentController));

export default router;
