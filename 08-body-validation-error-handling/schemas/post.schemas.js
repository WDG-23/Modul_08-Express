import { z } from 'zod/v4';

const postSchema = z.object({
  title: z
    .string('Title must be a string')
    .min(1, 'Title must be at least 1 character.')
    .max(255, 'Title must be at most 255 character.')
    .default('Lorem ipsum'),
  content: z.string().min(1, 'Content must not be empty'),
  userId: z.int().positive(),
});

export { postSchema };
