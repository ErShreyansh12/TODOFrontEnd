export const METRICS = [
  { key: 'total-staff', label: 'Total Staff', value: '42', delta: '+2', icon: 'groups' },
  { key: 'active-now', label: 'Active Now', value: '38', icon: 'person_check' },
  { key: 'total-tasks', label: 'Total Tasks', value: '1,204', icon: 'task' },
  { key: 'todays-tasks', label: "Today's Tasks", value: '156', icon: 'today' },
]

export const STATUS_BREAKDOWN = [
  { key: 'pending', label: 'Pending', value: 45, borderClass: 'border-status-pending', textClass: 'text-status-pending' },
  {
    key: 'scheduled',
    label: 'Scheduled',
    value: 82,
    borderClass: 'border-status-scheduled',
    textClass: 'text-status-scheduled',
  },
  {
    key: 'completed',
    label: 'Completed',
    value: 24,
    borderClass: 'border-status-completed',
    textClass: 'text-status-completed',
  },
  { key: 'delayed', label: 'Delayed', value: 5, borderClass: 'border-status-delayed', textClass: 'text-status-delayed' },
]

export const STAFF_SUMMARY = [
  { id: 1, name: 'Rahul Sharma', total: 45, completed: 30, pending: 15 },
  { id: 2, name: 'Amit Patel', total: 38, completed: 12, pending: 26 },
  { id: 3, name: 'Neha Gupta', total: 52, completed: 48, pending: 4 },
]

export const OVERALL_PRODUCTIVITY = 75
