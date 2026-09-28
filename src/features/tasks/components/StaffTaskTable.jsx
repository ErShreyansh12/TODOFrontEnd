import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { formatShortDate, formatTime, isTaskOverdue } from '@/features/tasks/utils/task.utils'

export default function StaffTaskTable({ tasks, isLoading = false, isError = false }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-light bg-surface-subtle text-label-bold font-bold tracking-[0.05em] text-on-surface-variant uppercase">
              <th className="p-unit-md py-unit-sm font-medium">Task Title</th>
              <th className="p-unit-md py-unit-sm font-medium">Due Date</th>
              <th className="p-unit-md py-unit-sm font-medium">Due Time</th>
              <th className="p-unit-md py-unit-sm text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-body-md text-on-surface">
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-unit-lg text-center text-on-surface-variant">
                  Loading tasks…
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td colSpan={4} className="p-unit-lg text-center text-error">
                  Couldn't load tasks. Please refresh the page.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              tasks.map((task) => {
              const overdue = isTaskOverdue(task)
              const detailPath = `${ROUTES.STAFF_TASK_BOARD}/${task.id}`

              return (
                <tr key={task.id} className="transition-colors hover:bg-surface-subtle">
                  <td className="max-w-xs p-unit-md">
                    <Link to={detailPath} className="font-bold text-on-surface hover:text-primary hover:underline">
                      {task.title}
                    </Link>
                  </td>
                  <td className="p-unit-md">
                    <span
                      className={`flex items-center gap-1 whitespace-nowrap text-body-md ${
                        overdue ? 'font-bold text-status-delayed' : 'text-on-surface-variant'
                      }`}
                    >
                      {overdue && <span className="material-symbols-outlined text-[16px]">schedule</span>}
                      {formatShortDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="p-unit-md whitespace-nowrap text-on-surface-variant">
                    {formatTime(task.time) ?? '—'}
                  </td>
                  <td className="p-unit-md">
                    <div className="flex items-center justify-end">
                      <Link
                        to={detailPath}
                        title="View details"
                        className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )
              })}
            {!isLoading && !isError && tasks.length === 0 && (
              <tr>
                <td colSpan={4} className="p-unit-lg text-center text-on-surface-variant">
                  No tasks match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
