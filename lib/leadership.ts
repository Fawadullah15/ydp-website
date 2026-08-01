import { z } from 'zod';

export const leadershipSchema = z.object({
  name: z.string().trim().min(2),
  position: z.string().trim().min(2),
  bio: z.string().trim().max(5000).optional().nullable().or(z.literal('')),
  photo: z.string().trim().max(4096).optional().nullable().or(z.literal('')),
  email: z.string().trim().email().optional().nullable().or(z.literal('')),
  phone: z.string().trim().max(50).optional().nullable().or(z.literal('')),
  facebook: z.string().url().optional().nullable().or(z.literal('')),
  twitter: z.string().url().optional().nullable().or(z.literal('')),
  linkedin: z.string().url().optional().nullable().or(z.literal('')),
  instagram: z.string().url().optional().nullable().or(z.literal('')),
  level: z.enum(['NATIONAL', 'HWO', 'PROVINCIAL', 'DISTRICT', 'AMBASSADOR', 'REGIONAL']).default('NATIONAL'),
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
  isActive: z.boolean().default(true),
  provinceId: z.string().min(1).optional().nullable(),
});
