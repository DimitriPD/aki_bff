import { Router } from 'express';
import { OccurrenceController } from '../controllers/OccurrenceController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const occurrenceController = new OccurrenceController();

/**
 * @route GET /occurrences
 * @desc List occurrences (paginated with filters)
 * @access Protected
 */
router.get('/', authMiddleware, (req, res, next) =>
  occurrenceController.getOccurrences(req, res, next),
);

/**
 * @route POST /occurrences
 * @desc Create a new occurrence
 * @access Protected
 */
router.post('/', authMiddleware, (req, res, next) =>
  occurrenceController.createOccurrence(req, res, next),
);

export default router;
