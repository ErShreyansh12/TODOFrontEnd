import { z } from 'zod'

export const addStaffSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
})
