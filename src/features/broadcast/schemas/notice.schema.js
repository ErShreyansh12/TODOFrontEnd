import { z } from 'zod'

export const createNoticeSchema = z.object({
  title: z.string().min(1, 'Notice title is required'),
  message: z.string().optional(),
  recipientIds: z.array(z.string()).min(1, 'Select at least one staff member'),
})
