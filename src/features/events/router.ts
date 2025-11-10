import express from 'express';
import { createEventHandler } from './createEvent/controller';
import { deleteEventHandler } from './deleteEvent/controller';
import { getEventDetailHandler } from './getEventDetail/controller';
import { updateEventHandler } from './updateEvent/controller';
import { getEventsHandler } from './getEvents/controller';
import { getEventQRHandler } from './getEventQR/controller';

export function buildEventsRouter() {
  const router = express.Router();
  router.get('/', getEventsHandler);
  router.post('/', createEventHandler);
  router.get('/:eventId', getEventDetailHandler);
  router.put('/:eventId', updateEventHandler);
  router.delete('/:eventId', deleteEventHandler);
  router.get('/:eventId/qr', getEventQRHandler);
  return router;
}
