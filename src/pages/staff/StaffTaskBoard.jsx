import { useMemo, useState } from 'react'
import StaffTaskTable from '@/features/tasks/components/StaffTaskTable'
import DelayReasonModal from '@/features/tasks/components/DelayReasonModal'
import { useTaskStore } from '@/features/tasks/store/taskStore'
import { useAuthStore } from '@/store/authStore'
import { STATUS_META, getDisplayStatus } from '@/features/tasks/utils/task.utils'

const STATUS_FILTER_OPTIONS = [
  { key: 'all', label: 'All Statuses' },
  ...Object.entries(STATUS_META).map(([key, meta]) => ({ key, label: meta.label })),
]

export default function StaffTaskBoard() {
  const user = useAuthStore((state) => state.user)
  const allTasks = useTaskStore((state) => state.tasks)
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus)
  const setDelayReason = useTaskStore((state) => state.setDelayReason)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [reasonTask, setReasonTask] = useState(null)

  const myTasks = useMemo(() => allTasks.filter((task) => task.assignedTo === user?.id), [allTasks, user?.id])

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return myTasks.filter((task) => {
      if (query && !task.title.toLowerCase().includes(query)) return false
      if (statusFilter !== 'all' && getDisplayStatus(task) !== statusFilter) return false
      return true
    })
  }, [myTasks, search, statusFilter])

  const handleSaveReason = (taskId, reason) => setDelayReason(taskId, reason)

  return (
    <>
      <div>
        <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
          Task Board
        </h2>
        <p className="text-body-lg text-on-surface-variant">Your assigned tasks, all in one place.</p>
      </div>

      <div className="flex flex-wrap items-center gap-unit-md">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your tasks by title..."
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
      </div>

      <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-border-light bg-surface-container-lowest px-unit-md py-unit-sm text-label-md text-on-surface-variant">
        <span className="material-symbols-outlined text-[15px]">info</span>
        You can update the status of your tasks here. If a task runs past its due date, add a reason so admin can see
        why.
      </div>

      <StaffTaskTable tasks={filteredTasks} onStatusChange={updateTaskStatus} onAddReason={setReasonTask} />

      <p className="text-label-md text-on-surface-variant">
        Showing {filteredTasks.length} of {myTasks.length} tasks
      </p>

      {reasonTask && (
        <DelayReasonModal task={reasonTask} onClose={() => setReasonTask(null)} onSave={handleSaveReason} />
      )}
    </>
  )
}
