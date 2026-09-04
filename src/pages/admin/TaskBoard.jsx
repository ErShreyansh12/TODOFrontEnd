import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskColumn from '@/features/tasks/components/TaskColumn'
import EditTaskModal from '@/features/tasks/components/EditTaskModal'
import { INITIAL_TASKS } from '@/features/tasks/data/board-tasks.data'
import { COLUMN_DEFS, CURRENT_USER_ID, getDisplayStatus } from '@/features/tasks/utils/task.utils'
import { ROUTES } from '@/constants/routes'

const OWNER_FILTERS = [
  { key: 'all', label: 'All Tasks' },
  { key: 'mine', label: 'My Tasks' },
  { key: 'staff', label: 'Staff Tasks' },
]

export default function TaskBoard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [search, setSearch] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [editingTask, setEditingTask] = useState(null)

  const mineCount = useMemo(() => tasks.filter((task) => task.assignedTo === CURRENT_USER_ID).length, [tasks])
  const staffCount = tasks.length - mineCount

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      if (query && !task.title.toLowerCase().includes(query)) return false
      if (ownerFilter === 'mine' && task.assignedTo !== CURRENT_USER_ID) return false
      if (ownerFilter === 'staff' && task.assignedTo === CURRENT_USER_ID) return false
      return true
    })
  }, [tasks, search, ownerFilter])

  const tasksByColumn = useMemo(() => {
    const buckets = { todo: [], in_progress: [], delayed: [], completed: [] }
    filteredTasks.forEach((task) => {
      buckets[getDisplayStatus(task)].push(task)
    })
    return buckets
  }, [filteredTasks])

  const handleStatusChange = (taskId, status) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }

  const handleSaveEdit = (taskId, values) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...values } : task)))
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-unit-md md:flex-row md:items-end">
        <div>
          <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
            Task Board
          </h2>
          <p className="text-body-lg text-on-surface-variant">Your tasks and your team's, grouped by status.</p>
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

      <div className="-mx-margin-mobile flex snap-x snap-mandatory gap-unit-md overflow-x-auto px-margin-mobile pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-gutter lg:overflow-visible lg:px-0">
        {COLUMN_DEFS.map((def) => (
          <TaskColumn
            key={def.key}
            def={def}
            tasks={tasksByColumn[def.key]}
            onEdit={setEditingTask}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={handleSaveEdit} />
      )}
    </>
  )
}
