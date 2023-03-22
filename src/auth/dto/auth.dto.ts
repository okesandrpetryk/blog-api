import { z } from 'zod';

export const RegisterDto = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});

export type IRegisterDto = z.infer<typeof RegisterDto>;

export const LogInDto = z
  .object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string(),
  })
  .refine((data) => data.email && data.username, {
    message: 'Email or username is required',
  });

export type ILoginDto = z.infer<typeof LogInDto>;
