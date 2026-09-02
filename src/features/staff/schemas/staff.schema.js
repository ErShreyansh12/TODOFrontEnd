import { z } from 'zod'

export const addStaffSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
})
