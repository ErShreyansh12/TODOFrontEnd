import { z } from 'zod'

export const delayReasonSchema = z.object({
  delayReason: z.string().min(1, 'Please add a reason for the delay'),
})
