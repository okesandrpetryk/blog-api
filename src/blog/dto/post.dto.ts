import { z } from 'zod';

export const PostZod = z.object({
  title: z.string(),
  content: z.string(),
});
