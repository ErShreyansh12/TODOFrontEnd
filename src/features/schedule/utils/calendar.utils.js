const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const toDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const addDays = (date, amount) => {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export const addMonths = (date, amount) => {
  const next = new Date(date)
  next.setMonth(next.getMonth() + amount)
  return next
}

// Weeks run Monday to Sunday, same as the task boards. getDay() is 0 for Sunday, so Sunday counts as the
// 7th day: it steps back 6 days to its own week's Monday, not forward to the next one.
export const startOfWeek = (date) => {
  const start = new Date(date)
  const daysSinceMonday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - daysSinceMonday)
  return start
}

export const getWeekDates = (date) => {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}

export const getMonthMatrix = (date) => {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const gridStart = startOfWeek(firstOfMonth)

  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addDays(gridStart, week * 7 + day)),
  )
}

export const formatMonthLabel = (date) => `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`

export const formatWeekdayShort = (date) => WEEKDAY_SHORT[date.getDay()]

export const formatFullDate = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

export const formatWeekRangeLabel = (weekDates) => {
  const start = weekDates[0]
  const end = weekDates[6]
  const startLabel = `${MONTH_NAMES[start.getMonth()].slice(0, 3)} ${start.getDate()}`
  const endLabel =
    start.getMonth() === end.getMonth()
      ? `${end.getDate()}`
      : `${MONTH_NAMES[end.getMonth()].slice(0, 3)} ${end.getDate()}`
  return `${startLabel} – ${endLabel}, ${end.getFullYear()}`
}

// "14:30" (the API's 24-hour HH:mm) -> "2:30 PM" for display.
export const formatTimeLabel = (value) => {
  if (!value) return ''
  const [hours, minutes] = value.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`
}

// The calendar draws one window at a time. This is the first and last day (YYYY-MM-DD) the API is asked
// for: the whole month, the Monday-to-Sunday week, or just the one day.
export const getViewRange = (view, date) => {
  if (view === 'month') {
    return {
      from: toDateKey(new Date(date.getFullYear(), date.getMonth(), 1)),
      to: toDateKey(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
    }
  }
  if (view === 'week') {
    const week = getWeekDates(date)
    return { from: toDateKey(week[0]), to: toDateKey(week[6]) }
  }
  const day = toDateKey(date)
  return { from: day, to: day }
}

// Edit locks this many minutes before the start. The server works out the exact moments (editableUntil,
// endsAt) and sends them with every meeting, so the browser's own time zone never decides them.
export const MEETING_CHANGE_CUTOFF_MINUTES = 15

const hasMeetingEnded = (event, now) => Boolean(event.endsAt) && now.getTime() >= new Date(event.endsAt).getTime()

// Editing: open until 15 minutes before the start, never again afterwards.
export const canChangeMeeting = (event, now = new Date()) => {
  if (!event.editableUntil) return true
  return now.getTime() <= new Date(event.editableUntil).getTime()
}

// Deleting: open until 15 minutes before the start, and again once the meeting has ended.
export const canDeleteMeeting = (event, now = new Date()) =>
  canChangeMeeting(event, now) || hasMeetingEnded(event, now)

// Why a meeting can't be edited - shown on the card and as the button tooltip.
export const meetingLockReason = (event, now = new Date()) => {
  if (hasMeetingEnded(event, now)) return 'This meeting has ended, so it can no longer be edited.'
  const startsAt = new Date(event.editableUntil).getTime() + MEETING_CHANGE_CUTOFF_MINUTES * 60 * 1000
  return now.getTime() >= startsAt
    ? 'This meeting is in progress.'
    : `Can't be changed within ${MEETING_CHANGE_CUTOFF_MINUTES} minutes of the start time.`
}

export const meetingDeleteLockReason = () => 'It can be deleted once the meeting has ended.'
