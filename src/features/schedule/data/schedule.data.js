import { toDateKey } from '@/features/schedule/utils/calendar.utils'

const today = new Date()
const dateForDay = (day) => toDateKey(new Date(today.getFullYear(), today.getMonth(), day))

export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: '10am Standup',
    date: dateForDay(2),
    startTime: '10:00 AM',
    endTime: '10:15 AM',
    type: 'meeting',
    location: null,
  },
  {
    id: 'evt-2',
    title: 'Q3 Report Due',
    date: dateForDay(3),
    type: 'deadline',
  },
  {
    id: 'evt-3',
    title: '1pm Client Sync',
    date: dateForDay(6),
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    type: 'meeting',
    location: null,
  },
  {
    id: 'evt-4',
    title: 'Design System Review',
    date: dateForDay(8),
    startTime: '9:00 AM',
    endTime: '10:30 AM',
    type: 'meeting',
    location: null,
  },
  {
    id: 'evt-5',
    title: 'All-Hands Sync',
    date: dateForDay(8),
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    type: 'meeting',
    location: 'Conference Room A',
  },
  {
    id: 'evt-6',
    title: 'Launch Alpha Phase',
    date: dateForDay(10),
    type: 'deadline',
  },
]
