import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const eventController = new EventController();

/**
 * @route GET /events
 * @desc List events (paginated with filters)
 * @access Protected
 */
router.get('/', authMiddleware, (req, res, next) =>
  eventController.getEvents(req, res, next),
);

/**
 * @route POST /events
 * @desc Create a new event
 * @access Protected
 */
router.post('/', authMiddleware, (req, res, next) =>
  eventController.createEvent(req, res, next),
);

/**
 * @route GET /events/:eventId
 * @desc Get event by ID
 * @access Protected
 */
router.get('/:eventId', authMiddleware, (req, res, next) =>
  eventController.getEvent(req, res, next),
);

/**
 * @route PUT /events/:eventId
 * @desc Update event
 * @access Protected
 */
router.put('/:eventId', authMiddleware, (req, res, next) =>
  eventController.updateEvent(req, res, next),
);

/**
 * @route DELETE /events/:eventId
 * @desc Delete event
 * @access Protected
 */
router.delete('/:eventId', authMiddleware, (req, res, next) =>
  eventController.deleteEvent(req, res, next),
);

/**
 * @route GET /events/:eventId/qr
 * @desc Get event QR code
 * @access Protected
 */
router.get('/:eventId/qr', authMiddleware, (req, res, next) =>
  eventController.getEventQR(req, res, next),
);

export default router;
