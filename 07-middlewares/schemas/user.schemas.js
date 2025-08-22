import { z } from 'zod/v4';

const UserPostSchema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().max(255),
  lastName: z.string().max(255),
  age: z.number().positive(),
});

const UserUpdateSchema = z.object({
  email: z.string().trim().email().optional(),
  firstName: z.string().max(255),
  lastName: z.string().max(255).optional(),
  age: z.number().positive(),
});

export { UserPostSchema, UserUpdateSchema };
