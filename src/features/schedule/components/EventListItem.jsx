import { useEffect, useState } from 'react'
import {
  canChangeMeeting,
  canDeleteMeeting,
  meetingDeleteLockReason,
  meetingLockReason,
} from '@/features/schedule/utils/calendar.utils'

// Re-checks the 15-minute cutoff and the end time while the page stays open, so buttons lock and unlock on time.
const CUTOFF_CHECK_INTERVAL_MS = 30 * 1000

const useNow = () => {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), CUTOFF_CHECK_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])
  return now
}

export default function EventListItem({ event, onEdit, onDelete }) {
  const isDeadline = event.type === 'deadline'
  const now = useNow()
  const canEdit = !isDeadline && canChangeMeeting(event, now)
  const canDelete = !isDeadline && canDeleteMeeting(event, now)
  const lockReason = !isDeadline && !canEdit ? meetingLockReason(event, now) : null
  const deleteLockReason = !isDeadline && !canDelete ? meetingDeleteLockReason() : null

  const actionClass = (enabled, hoverClass) =>
    `flex h-7 w-7 items-center justify-center rounded text-on-surface-variant transition-colors ${
      enabled ? hoverClass : 'cursor-not-allowed opacity-40'
    }`

  return (
    <div className="relative overflow-hidden rounded-lg border border-border-light bg-surface-container-lowest p-unit-md shadow-sm transition-shadow hover:shadow-md">
      <div className={`absolute inset-y-0 left-0 w-1 ${isDeadline ? 'bg-status-pending' : 'bg-status-scheduled'}`} />
      <div className="pl-2">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h4 className="text-label-bold font-bold text-on-surface">{event.title}</h4>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isDeadline ? 'bg-status-pending/10 text-status-pending' : 'bg-status-scheduled/10 text-status-scheduled'
            }`}
          >
            {isDeadline ? 'Task' : 'Meeting'}
          </span>
        </div>
        {!isDeadline && event.startTime && (
          <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            {event.startTime} - {event.endTime}
          </div>
        )}
        {event.location && (
          <div className="mt-1 flex items-center gap-2 text-label-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {event.location}
          </div>
        )}
        {event.description && (
          <p className="mt-2 text-body-md text-on-surface-variant">{event.description}</p>
        )}
        {!isDeadline && (
          <div className="mt-3 flex items-center justify-end gap-1 border-t border-border-light pt-2">
            {!canEdit && (
              <span className="mr-auto text-label-md text-on-surface-variant">
                {lockReason}
                {deleteLockReason && ` ${deleteLockReason}`}
              </span>
            )}
            <button
              type="button"
              title={canEdit ? 'Edit meeting' : lockReason}
              aria-label="Edit meeting"
              disabled={!canEdit}
              onClick={() => onEdit?.(event)}
              className={actionClass(canEdit, 'hover:bg-surface-container hover:text-primary')}
            >
              <span className="material-symbols-outlined text-[18px]">{canEdit ? 'edit' : 'lock'}</span>
            </button>
            <button
              type="button"
              title={canDelete ? 'Delete meeting' : `${lockReason} ${deleteLockReason}`}
              aria-label="Delete meeting"
              disabled={!canDelete}
              onClick={() => onDelete?.(event)}
              className={actionClass(canDelete, 'hover:bg-error-container hover:text-error')}
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
