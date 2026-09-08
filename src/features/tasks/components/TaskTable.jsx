import {
  CURRENT_USER_ID,
  PRIORITY_DOT_CLASS,
  STAFF_AVATAR_COLOR,
  STAFF_NAME_MAP,
  STATUS_META,
  canChangeStatus,
  canEditTask,
  capitalize,
  formatShortDate,
  getDisplayStatus,
  initialsOf,
  isTaskOverdue,
} from '@/features/tasks/utils/task.utils'

export default function TaskTable({ tasks, onEdit, onStatusChange }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-light bg-surface-subtle text-label-bold font-bold tracking-[0.05em] text-on-surface-variant uppercase">
              <th className="p-unit-md py-unit-sm font-medium">Task</th>
              <th className="p-unit-md py-unit-sm font-medium">Assignee</th>
              <th className="p-unit-md py-unit-sm font-medium">Due Date</th>
              <th className="p-unit-md py-unit-sm font-medium">Priority</th>
              <th className="p-unit-md py-unit-sm font-medium">Status</th>
              <th className="p-unit-md py-unit-sm text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-body-md text-on-surface">
            {tasks.map((task) => {
              const isOwn = task.assignedTo === CURRENT_USER_ID
              const assigneeName = isOwn ? 'You' : STAFF_NAME_MAP[task.assignedTo]
              const editable = canEditTask(task)
              const editableStatus = canChangeStatus(task)
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
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-on-primary"
                        style={{ backgroundColor: isOwn ? 'var(--color-primary)' : STAFF_AVATAR_COLOR[task.assignedTo] }}
                      >
                        {isOwn ? 'Y' : initialsOf(assigneeName)}
                      </span>
                      <span className="font-medium">{assigneeName}</span>
                    </div>
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
                    {editableStatus ? (
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
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${displayStatus.textClass} ${displayStatus.bgClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${displayStatus.dotClass}`} />
                        {displayStatus.label}
                      </span>
                    )}
                  </td>
                  <td className="p-unit-md text-right">
                    {editable ? (
                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        title="Edit task"
                        className="ml-auto flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    ) : (
                      <span
                        title="Locked — this staff task is past To Do"
                        className="ml-auto flex h-8 w-8 items-center justify-center rounded text-outline-variant"
                      >
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} className="p-unit-lg text-center text-on-surface-variant">
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
