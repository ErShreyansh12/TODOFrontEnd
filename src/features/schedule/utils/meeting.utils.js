import { formatTimeLabel } from '@/features/schedule/utils/calendar.utils'

// An API meeting -> the event shape the calendar views draw. Times come as 24-hour HH:mm; the calendar
// shows 12-hour labels, so both are kept (the label to display, the raw value to pre-fill the edit form).
export const mapApiMeeting = (meeting) => ({
  id: meeting.id,
  title: meeting.title,
  date: meeting.date,
  startTime: formatTimeLabel(meeting.startTime),
  endTime: formatTimeLabel(meeting.endTime),
  startTime24: meeting.startTime,
  endTime24: meeting.endTime,
  location: meeting.location,
  description: meeting.description,
  editableUntil: meeting.editableUntil,
  endsAt: meeting.endsAt,
  type: 'meeting',
})
