import { z } from 'zod'
import { createCustomDatesValidator } from '@/features/tasks/schemas/customDatesRefinement'

export const editTaskSchema = z
  .object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    attachment: z.any().optional(),
    broker: z.string().optional(),
    assignedTo: z.string().min(1, 'Please select a staff member'),
    timeline: z.string().min(1, 'Please select a timeline'),
    customDates: z.array(z.object({ date: z.string() })).optional(),
    dueDate: z.string().min(1, 'Due date is required'),
    priority: z.enum(['low', 'medium', 'high']),
  })
  .superRefine(createCustomDatesValidator({ checkPastDates: false }))
