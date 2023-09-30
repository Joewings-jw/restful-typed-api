import {z} from 'zod';

export const loginSchema = z
  .object({
    username: z
      .string()
      .refine(username => username !== undefined && username !== '', {
        message: 'Username is required',
      }),
    password: z
      .string()
      .refine(password => password !== undefined && password !== '', {
        message: 'Password is required',
      }),
  })
  .strict();

export const userSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
    working_position: z
      .number()
      .int()
      .refine(workingPosition => workingPosition >= 0 && workingPosition <= 4, {
        message:
          'Working position must be a valid number in the range of 0 to 4',
      }),
  })
  .strict();
