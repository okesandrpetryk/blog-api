import { z } from 'zod';

export const PostDto = z.object({
  title: z.string(),
  content: z.string(),
});

export type IPostDto = z.infer<typeof PostDto>;
