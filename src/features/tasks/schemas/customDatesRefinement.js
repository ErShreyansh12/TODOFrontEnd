import { z } from 'zod'

const todayISODate = () => new Date().toISOString().slice(0, 10)

export const createCustomDatesValidator =
  ({ checkPastDates = true } = {}) =>
  (data, ctx) => {
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

    if (!checkPastDates) return

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
  }

export const validateCustomDates = createCustomDatesValidator()
