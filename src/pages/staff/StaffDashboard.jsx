import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusCard from '@/features/dashboard/components/StatusCard'
import { useAuthStore } from '@/store/authStore'
import { useBroadcastStore } from '@/features/broadcast/store/broadcastStore'
import { INITIAL_TASKS } from '@/features/tasks/data/board-tasks.data'
import { STATUS_META, PRIORITY_DOT_CLASS } from '@/features/tasks/utils/task.utils'
import { INITIAL_NOTES } from '@/features/notes/data/notes.data'
import { stripHtml, formatRelativeTimestamp } from '@/features/notes/utils/notes.utils'
import { formatNoticeDate } from '@/features/broadcast/utils/broadcast.utils'
import { ROUTES } from '@/constants/routes'

const todayKey = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function StaffDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const notices = useBroadcastStore((state) => state.notices)

  const myNotices = useMemo(
    () => notices.filter((notice) => notice.status === 'active' && notice.recipientIds.includes(user?.id)),
    [notices, user?.id],
  )

  const todayTasks = useMemo(() => {
    const today = todayKey()
    return INITIAL_TASKS.filter((task) => task.assignedTo === user?.id && task.dueDate === today)
  }, [user?.id])

  const completedCount = todayTasks.filter((task) => task.status === 'completed').length
  const pendingCount = todayTasks.length - completedCount

  const pinnedNotes = useMemo(() => INITIAL_NOTES.filter((note) => note.pinned && !note.archived).slice(0, 2), [])

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <>
      <div className="flex flex-col justify-between gap-unit-md sm:flex-row sm:items-start">
        <div>
          <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
            Dashboard
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            Welcome back, {firstName}. Here's what's on your plate today.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-border-light bg-surface-container-lowest px-4 py-2 text-label-md font-bold text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          {todayLabel}
        </div>
      </div>

      <div className="space-y-1.5">
        {myNotices.length > 0 ? (
          myNotices.map((notice) => (
            <div
              key={notice.id}
              className="flex items-center gap-2.5 rounded-lg border border-border-light border-l-4 border-l-status-pending bg-surface-container-lowest px-3 py-2 shadow-sm"
            >
              <span className="material-symbols-outlined shrink-0 text-[16px] text-status-pending">campaign</span>
              <p className="min-w-0 flex-1 truncate text-label-bold font-bold text-on-surface">
                {notice.title}
                {notice.message && (
                  <span className="ml-1.5 font-medium text-on-surface-variant">— {notice.message}</span>
                )}
              </p>
              <span className="hidden shrink-0 text-label-md text-on-surface-variant sm:block">
                {formatNoticeDate(notice.createdAt)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-border-light bg-surface-container-lowest px-3 py-2 text-label-md text-on-surface-variant shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-status-completed">check_circle</span>
            You're all caught up — no notices right now.
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-unit-sm sm:grid-cols-3 md:gap-unit-md">
        <StatusCard
          label="Tasks Today"
          value={todayTasks.length}
          borderClass="border-primary-container"
          textClass="text-primary"
        />
        <StatusCard
          label="Completed"
          value={completedCount}
          borderClass="border-status-completed"
          textClass="text-status-completed"
        />
        <StatusCard
          label="Pending"
          value={pendingCount}
          borderClass="border-status-pending"
          textClass="text-status-pending"
        />
      </div>

      <div className="grid grid-cols-1 gap-margin-desktop lg:grid-cols-5">
        <div className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border-light p-unit-md">
            <h3 className="flex items-center gap-2 text-label-bold font-bold text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-primary">assignment</span>
              Today's Tasks
            </h3>
            <button
              type="button"
              onClick={() => navigate(ROUTES.STAFF_TASK_BOARD)}
              className="flex items-center gap-1 text-label-md font-bold text-primary hover:underline"
            >
              View Task Board
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
          {todayTasks.length > 0 ? (
            todayTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 border-b border-border-light p-unit-md last:border-b-0">
                <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT_CLASS[task.priority]}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-md font-bold text-on-surface">{task.title}</p>
                  <p className="text-label-md text-on-surface-variant capitalize">Due today · {task.priority} priority</p>
                </div>
                <span
                  className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-label-md font-bold ${STATUS_META[task.status].bgClass} ${STATUS_META[task.status].textClass}`}
                >
                  {STATUS_META[task.status].label}
                </span>
              </div>
            ))
          ) : (
            <p className="p-unit-lg text-center text-label-md text-on-surface-variant">
              Nothing due today. Enjoy the breather.
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border-light p-unit-md">
            <h3 className="flex items-center gap-2 text-label-bold font-bold text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-primary">push_pin</span>
              Pinned Notes
            </h3>
            <button
              type="button"
              onClick={() => navigate(ROUTES.PRIVATE_NOTES)}
              className="flex items-center gap-1 text-label-md font-bold text-primary hover:underline"
            >
              View All
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
          {pinnedNotes.length > 0 ? (
            pinnedNotes.map((note) => (
              <div key={note.id} className="border-b border-border-light p-unit-md last:border-b-0">
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-primary-container" data-weight="fill">
                    keep
                  </span>
                  <p className="truncate text-body-md font-bold text-on-surface">{note.title}</p>
                </div>
                <p className="line-clamp-2 text-label-md text-on-surface-variant">{stripHtml(note.contentHtml)}</p>
                <p className="mt-1 text-label-md text-on-surface-variant">{formatRelativeTimestamp(note.updatedAt)}</p>
              </div>
            ))
          ) : (
            <p className="p-unit-lg text-center text-label-md text-on-surface-variant">No pinned notes yet.</p>
          )}
        </div>
      </div>
    </>
  )
}
