import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskTable from '@/features/tasks/components/TaskTable'
import EditTaskModal from '@/features/tasks/components/EditTaskModal'
import { useTaskStore } from '@/features/tasks/store/taskStore'
import { CURRENT_USER_ID, STATUS_META, getDisplayStatus } from '@/features/tasks/utils/task.utils'
import { ROUTES } from '@/constants/routes'

const OWNER_FILTERS = [
  { key: 'all', label: 'All Tasks' },
  { key: 'mine', label: 'My Tasks' },
  { key: 'staff', label: 'Staff Tasks' },
]

const STATUS_FILTER_OPTIONS = [
  { key: 'all', label: 'All Statuses' },
  ...Object.entries(STATUS_META).map(([key, meta]) => ({ key, label: meta.label })),
]

export default function TaskBoard() {
  const navigate = useNavigate()
  const tasks = useTaskStore((state) => state.tasks)
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus)
  const updateTask = useTaskStore((state) => state.updateTask)
  const [search, setSearch] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingTask, setEditingTask] = useState(null)

  const mineCount = useMemo(() => tasks.filter((task) => task.assignedTo === CURRENT_USER_ID).length, [tasks])
  const staffCount = tasks.length - mineCount

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      if (query && !task.title.toLowerCase().includes(query)) return false
      if (ownerFilter === 'mine' && task.assignedTo !== CURRENT_USER_ID) return false
      if (ownerFilter === 'staff' && task.assignedTo === CURRENT_USER_ID) return false
      if (statusFilter !== 'all' && getDisplayStatus(task) !== statusFilter) return false
      return true
    })
  }, [tasks, search, ownerFilter, statusFilter])

  const handleStatusChange = (taskId, status) => {
    updateTaskStatus(taskId, status)
  }

  const handleSaveEdit = (taskId, values) => {
    updateTask(taskId, values)
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-unit-md md:flex-row md:items-end">
        <div>
          <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
            Task Board
          </h2>
          <p className="text-body-lg text-on-surface-variant">Your tasks and your team's, all in one place.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_TASKS_CREATE)}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-unit-md py-unit-sm text-label-bold font-bold tracking-[0.05em] text-on-primary uppercase transition-colors hover:bg-primary"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Create New Task
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-unit-md">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks by title..."
          className="h-9 min-w-[200px] flex-1 rounded-lg border border-border-light bg-surface-container-lowest px-4 text-body-md text-on-surface shadow-sm transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-9 rounded-lg border border-border-light bg-surface-container-lowest px-3 text-body-md text-on-surface shadow-sm transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-container-lowest p-1 shadow-sm">
          {OWNER_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setOwnerFilter(filter.key)}
              className={`rounded px-3 py-1.5 text-label-md font-bold whitespace-nowrap transition-colors ${
                ownerFilter === filter.key
                  ? 'bg-surface-container text-on-surface'
                  : 'text-on-surface-variant hover:bg-surface-subtle'
              }`}
            >
              {filter.label}{' '}
              <span className="opacity-70 tabular-nums">
                {filter.key === 'all' ? tasks.length : filter.key === 'mine' ? mineCount : staffCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-unit-lg gap-y-1 rounded-lg border border-dashed border-border-light bg-surface-container-lowest px-unit-md py-unit-sm text-label-md text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">check_circle</span>
          You set the status only on tasks assigned to <strong className="text-on-surface">you</strong>.
        </span>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">lock</span>
          Staff tasks lock for editing once past <strong className="text-on-surface">To Do</strong>.
        </span>
      </div>

      <TaskTable tasks={filteredTasks} onEdit={setEditingTask} onStatusChange={handleStatusChange} />

      <p className="text-label-md text-on-surface-variant">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

      {editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={handleSaveEdit} />
      )}
    </>
  )
}
