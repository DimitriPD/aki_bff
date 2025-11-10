import { z } from 'zod';

export const createEventSchema = z.object({
  class_id: z.number().int().positive(),
  teacher_id: z.number().int().positive(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

export const updateEventSchema = z.object({
  eventId: z.string(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  status: z.enum(['active', 'closed', 'canceled']).optional(),
});

export const getEventSchema = z.object({
  eventId: z.string(),
});
