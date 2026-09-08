import { STAFF_OPTIONS } from '@/features/tasks/data/task-options.data'

export const CURRENT_USER_ID = 'admin'

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
}

export const STATUS_META = {
  todo: {
    label: 'To Do',
    dotClass: 'bg-status-scheduled',
    textClass: 'text-status-scheduled',
    bgClass: 'bg-status-scheduled/10',
  },
  in_progress: {
    label: 'In Progress',
    dotClass: 'bg-status-pending',
    textClass: 'text-status-pending',
    bgClass: 'bg-status-pending/10',
  },
  delayed: {
    label: 'Delayed',
    dotClass: 'bg-status-delayed',
    textClass: 'text-status-delayed',
    bgClass: 'bg-status-delayed/10',
  },
  completed: {
    label: 'Completed',
    dotClass: 'bg-status-completed',
    textClass: 'text-status-completed',
    bgClass: 'bg-status-completed/10',
  },
}

export const PRIORITY_DOT_CLASS = {
  low: 'bg-status-scheduled',
  medium: 'bg-status-pending',
  high: 'bg-status-delayed',
}

export const STAFF_NAME_MAP = Object.fromEntries(
  STAFF_OPTIONS.filter((option) => option.value !== CURRENT_USER_ID).map((option) => [option.value, option.label]),
)

export const STAFF_AVATAR_COLOR = {
  rahul: '#006c49',
  amit: '#3f465c',
  neha: '#10b981',
}

const toDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const isTaskOverdue = (task, today = new Date()) =>
  task.status !== TASK_STATUS.COMPLETED && task.dueDate < toDateKey(today)

export const getDisplayStatus = (task, today = new Date()) => {
  if (task.status === TASK_STATUS.COMPLETED) return 'completed'
  return isTaskOverdue(task, today) ? 'delayed' : task.status
}

export const canEditTask = (task, currentUserId = CURRENT_USER_ID) =>
  task.assignedTo === currentUserId || task.status === TASK_STATUS.TODO

export const canChangeStatus = (task, currentUserId = CURRENT_USER_ID) => task.assignedTo === currentUserId

export const formatShortDate = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const initialsOf = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)
