import { z } from 'zod'

export const NEW_PASSWORD_MIN_LENGTH = 6

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(NEW_PASSWORD_MIN_LENGTH, `Password must be at least ${NEW_PASSWORD_MIN_LENGTH} characters long`),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((values) => !values.confirmPassword || values.confirmPassword === values.newPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
