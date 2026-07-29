import { z } from 'zod';

export const memberRegistrationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, 'CNIC must use 00000-0000000-0 format'),
  address: z.string().min(5),
  province: z.string(),
  city: z.string(),
  education: z.string(),
  occupation: z.string().min(1),
  skills: z.string(),
  bio: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Date of birth must be a valid date'),
  membershipType: z.string(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export const eventRegistrationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

export const volunteerApplicationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  interests: z.string(),
  availability: z.string(),
  experience: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const newsArticleSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  tags: z.string().optional(),
  image: z.string().optional(),
  coverImage: z.string().optional(),
  imageUrl: z.string().optional(),
  province: z.string().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  startDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'A valid event date and time is required.'),
  endDate: z.string().refine((value) => !value || !Number.isNaN(Date.parse(value)), 'End date must be valid.').optional(),
  venue: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  type: z.string(),
  maxAttendees: z.number().int().positive().optional(),
  image: z.string().optional(),
  coverImage: z.string().optional(),
  registrationDeadline: z.string().refine((value) => !value || !Number.isNaN(Date.parse(value)), 'Registration deadline must be valid.').optional(),
  registrationMode: z.enum(['INTERNAL', 'EXTERNAL', 'CLOSED']).default('INTERNAL'),
  registrationLink: z.string().url().refine((url) => url.startsWith('https://'), 'Registration link must use HTTPS').optional().or(z.literal('')),
  authorId: z.string().optional(),
  provinceId: z.string().cuid().optional().nullable(),
  status: z.enum(['DRAFT', 'UPCOMING', 'COMPLETED', 'CANCELLED']).optional(),
}).superRefine((data, ctx) => {
  if (data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'End date cannot be before the event start date.' });
  }
  if (data.registrationDeadline && new Date(data.registrationDeadline) > new Date(data.startDate)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['registrationDeadline'], message: 'Registration must close on or before the event start date.' });
  }
  if (data.registrationMode === 'EXTERNAL' && !data.registrationLink) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['registrationLink'], message: 'An HTTPS registration link is required for external registration.' });
  }
});

export const leadershipProfileSchema = z.object({
  name: z.string().min(2),
  role: z.string(),
  level: z.string(),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional(),
  province: z.string().optional(),
  socialLinks: z.any().optional(),
});
