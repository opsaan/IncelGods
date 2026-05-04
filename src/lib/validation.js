import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3).max(90),
  body: z.string().min(3).max(1200),
  imageUrl: z.string().url().optional().or(z.literal(''))
});
