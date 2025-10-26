import { z } from 'zod';

export const bindDeviceSchema = z.object({
  cpf: z.string().length(11, 'CPF must be 11 digits'),
  device_id: z.string().min(1, 'Device ID is required'),
});

export const scanQRSchema = z.object({
  qr_token: z.string().min(1, 'QR token is required'),
  device_id: z.string().min(1, 'Device ID is required'),
  student_cpf: z.string().length(11).optional(),
  location: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
});
