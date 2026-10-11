import { z } from 'zod'

export const addMeetingSchema = z
  .object({
    title: z.string().trim().min(1, 'Meeting title is required'),
    date: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    location: z.string().trim().min(1, 'Location is required'),
    description: z.string().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after the start time',
    path: ['endTime'],
  })
