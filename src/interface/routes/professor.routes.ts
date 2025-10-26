import { Router } from 'express';
import { ProfessorController } from '../controllers/ProfessorController';
import { authMiddleware, validate } from '../middlewares';
import { createEventSchema, updateEventSchema, getEventSchema } from '../../application/use-cases/professor';

const router = Router();
const professorController = new ProfessorController();

// All professor routes require authentication
router.use(authMiddleware);

/**
 * @route GET /professor/dashboard
 * @desc Get aggregated dashboard data for professor
 * @access Private
 */
router.get('/dashboard', professorController.getDashboard.bind(professorController));

/**
 * @route POST /professor/events
 * @desc Create a new event
 * @access Private
 */
router.post(
  '/events',
  validate(createEventSchema),
  professorController.createEvent.bind(professorController),
);

/**
 * @route GET /professor/events/:eventId
 * @desc Get event details
 * @access Private
 */
router.get(
  '/events/:eventId',
  validate(getEventSchema),
  professorController.getEvent.bind(professorController),
);

/**
 * @route PUT /professor/events/:eventId
 * @desc Update event
 * @access Private
 */
router.put(
  '/events/:eventId',
  validate(updateEventSchema),
  professorController.updateEvent.bind(professorController),
);

/**
 * @route DELETE /professor/events/:eventId
 * @desc Delete event
 * @access Private
 */
router.delete(
  '/events/:eventId',
  validate(getEventSchema),
  professorController.deleteEvent.bind(professorController),
);

/**
 * @route GET /professor/events/:eventId/qr
 * @desc Get QR code for event
 * @access Private
 */
router.get(
  '/events/:eventId/qr',
  validate(getEventSchema),
  professorController.getEventQR.bind(professorController),
);

export default router;
