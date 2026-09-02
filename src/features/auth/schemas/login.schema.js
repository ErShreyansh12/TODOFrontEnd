import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().min(1, 'ID or email is required'),
  password: z.string().min(1, 'Password is required'),
})
