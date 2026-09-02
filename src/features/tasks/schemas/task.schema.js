import { z } from 'zod'

const todayISODate = () => new Date().toISOString().slice(0, 10)

export const createTaskSchema = z
  .object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    attachment: z.any().optional(),
    assignedTo: z.string().min(1, 'Please select a staff member'),
    timeline: z.string().min(1, 'Please select a timeline'),
    customDates: z.array(z.object({ date: z.string() })).optional(),
    priority: z.enum(['low', 'medium', 'high']),
    status: z.enum(['pending', 'scheduled']),
  })
  .superRefine((data, ctx) => {
    if (data.timeline !== 'custom') return

    const dates = data.customDates ?? []
    const filledDates = dates.filter((entry) => entry.date)

    if (filledDates.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['customDates'],
        message: 'Select at least one date',
      })
      return
    }

    const today = todayISODate()
    dates.forEach((entry, index) => {
      if (entry.date && entry.date < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customDates', index, 'date'],
          message: 'Date cannot be in the past',
        })
      }
    })
  })
