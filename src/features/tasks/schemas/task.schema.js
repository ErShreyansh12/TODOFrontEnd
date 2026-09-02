import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  attachment: z.any().optional(),
  assignedTo: z.string().min(1, 'Please select a staff member'),
  timeline: z.string().min(1, 'Please select a timeline'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'scheduled']),
})
