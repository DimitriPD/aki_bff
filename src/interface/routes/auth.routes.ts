import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../../application/use-cases/auth';

const router = Router();
const authController = new AuthController();

/**
 * @route POST /auth/login
 * @desc Mock teacher login (temporary)
 * @access Public
 */
router.post('/login', validate(loginSchema), authController.login.bind(authController));

/**
 * @route POST /auth/forgot-password
 * @desc Request password recovery email
 * @access Public
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController),
);

export default router;
