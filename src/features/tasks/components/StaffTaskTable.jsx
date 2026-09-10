import {
  PRIORITY_DOT_CLASS,
  STATUS_META,
  capitalize,
  formatShortDate,
  getDisplayStatus,
  isTaskOverdue,
} from '@/features/tasks/utils/task.utils'

export default function StaffTaskTable({ tasks, onStatusChange, onAddReason }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-light bg-surface-subtle text-label-bold font-bold tracking-[0.05em] text-on-surface-variant uppercase">
              <th className="p-unit-md py-unit-sm font-medium">Task</th>
              <th className="p-unit-md py-unit-sm font-medium">Due Date</th>
              <th className="p-unit-md py-unit-sm font-medium">Priority</th>
              <th className="p-unit-md py-unit-sm font-medium">Status</th>
              <th className="p-unit-md py-unit-sm text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-body-md text-on-surface">
            {tasks.map((task) => {
              const overdue = isTaskOverdue(task)
              const displayStatus = STATUS_META[getDisplayStatus(task)]

              return (
                <tr key={task.id} className="transition-colors hover:bg-surface-subtle">
                  <td className="max-w-xs p-unit-md">
                    <p className="font-bold text-on-surface">{task.title}</p>
                    {task.description && (
                      <p className="truncate text-label-md text-on-surface-variant">{task.description}</p>
                    )}
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
                  <td className="p-unit-md">
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT_CLASS[task.priority]}`} />
                      {capitalize(task.priority)}
                    </span>
                  </td>
                  <td className="p-unit-md">
                    <select
                      value={task.status}
                      onChange={(event) => onStatusChange(task.id, event.target.value)}
                      className={`cursor-pointer rounded-full border border-dashed py-1 pr-6 pl-3 text-[11px] font-bold ${displayStatus.textClass} ${displayStatus.bgClass}`}
                      style={{ borderColor: 'currentColor' }}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="p-unit-md text-right">
                    {overdue ? (
                      <button
                        type="button"
                        onClick={() => onAddReason(task)}
                        className={`ml-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-label-md font-bold transition-colors ${
                          task.delayReason
                            ? 'border-border-light text-on-surface-variant hover:bg-surface-subtle'
                            : 'border-error-container text-error hover:bg-error-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {task.delayReason ? 'edit_note' : 'warning'}
                        </span>
                        {task.delayReason ? 'Reason Added' : 'Add Reason'}
                      </button>
                    ) : (
                      <span className="text-on-surface-variant opacity-40">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="p-unit-lg text-center text-on-surface-variant">
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
