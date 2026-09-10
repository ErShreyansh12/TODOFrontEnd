import { STAFF_MEMBERS } from '@/features/staff/data/staff.data'
import { avatarColorFor, formatNoticeDate, initialsOf } from '@/features/broadcast/utils/broadcast.utils'

const STAFF_BY_ID = Object.fromEntries(STAFF_MEMBERS.map((member) => [member.id, member]))

function RecipientStack({ recipientIds }) {
  const visible = recipientIds.slice(0, 3)
  const overflow = recipientIds.length - visible.length

  return (
    <div className="flex items-center">
      {visible.map((id, index) => {
        const member = STAFF_BY_ID[id]
        return (
          <div
            key={id}
            title={member ? `${member.firstName} ${member.lastName}` : id}
            style={{ backgroundColor: avatarColorFor(id), marginLeft: index === 0 ? 0 : '-8px' }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-surface-container-lowest text-[10px] font-bold text-on-primary"
          >
            {member ? initialsOf(member.firstName, member.lastName) : '?'}
          </div>
        )
      })}
      {overflow > 0 && <span className="ml-2 text-label-md text-on-surface-variant">+{overflow}</span>}
    </div>
  )
}

function StatusPill({ status }) {
  const isActive = status === 'active'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-label-md font-bold ${
        isActive ? 'bg-status-completed/10 text-status-completed' : 'bg-surface-container text-on-surface-variant'
      }`}
    >
      <span className="material-symbols-outlined text-[13px]">{isActive ? 'check_circle' : 'visibility_off'}</span>
      {isActive ? 'Active' : 'Deactivated'}
    </span>
  )
}

export default function NoticeTable({ notices, onToggleStatus }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-light bg-surface-subtle text-label-bold font-bold tracking-[0.05em] text-on-surface-variant uppercase">
              <th className="p-unit-md py-unit-sm font-medium">Notice</th>
              <th className="p-unit-md py-unit-sm font-medium">Sent To</th>
              <th className="p-unit-md py-unit-sm font-medium">Sent By</th>
              <th className="p-unit-md py-unit-sm font-medium">Date</th>
              <th className="p-unit-md py-unit-sm font-medium">Status</th>
              <th className="p-unit-md py-unit-sm text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-body-md text-on-surface">
            {notices.map((notice) => (
              <tr
                key={notice.id}
                className={`transition-colors hover:bg-surface-subtle ${
                  notice.status === 'inactive' ? 'opacity-70' : ''
                }`}
              >
                <td className="p-unit-md">
                  <p className="font-bold text-on-surface">{notice.title}</p>
                  {notice.message && (
                    <p className="mt-0.5 max-w-xs truncate text-label-md text-on-surface-variant">{notice.message}</p>
                  )}
                </td>
                <td className="p-unit-md">
                  <RecipientStack recipientIds={notice.recipientIds} />
                </td>
                <td className="p-unit-md text-on-surface-variant">{notice.sentBy}</td>
                <td className="p-unit-md text-on-surface-variant">{formatNoticeDate(notice.createdAt)}</td>
                <td className="p-unit-md">
                  <StatusPill status={notice.status} />
                </td>
                <td className="p-unit-md text-right">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(notice.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-label-md font-bold transition-colors ${
                      notice.status === 'active'
                        ? 'border-error-container text-error hover:bg-error-container'
                        : 'border-status-completed text-status-completed hover:bg-status-completed/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {notice.status === 'active' ? 'visibility_off' : 'visibility'}
                    </span>
                    {notice.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan={6} className="p-unit-lg text-center text-on-surface-variant">
                  No notices match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
