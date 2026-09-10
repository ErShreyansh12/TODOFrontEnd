import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoticeTable from '@/features/broadcast/components/NoticeTable'
import { useBroadcastStore } from '@/features/broadcast/store/broadcastStore'
import { ROUTES } from '@/constants/routes'

const STATUS_FILTER_OPTIONS = [
  { key: 'all', label: 'All Statuses' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Deactivated' },
]

export default function Broadcast() {
  const navigate = useNavigate()
  const notices = useBroadcastStore((state) => state.notices)
  const toggleNoticeStatus = useBroadcastStore((state) => state.toggleNoticeStatus)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredNotices = useMemo(() => {
    const query = search.trim().toLowerCase()
    return notices.filter((notice) => {
      if (query && !notice.title.toLowerCase().includes(query)) return false
      if (statusFilter !== 'all' && notice.status !== statusFilter) return false
      return true
    })
  }, [notices, search, statusFilter])

  return (
    <>
      <div className="flex flex-col justify-between gap-unit-md md:flex-row md:items-end">
        <div>
          <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
            Broadcast / Notice
          </h2>
          <p className="text-body-lg text-on-surface-variant">Announcements sent to your staff members.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_BROADCAST_CREATE)}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-unit-md py-unit-sm text-label-bold font-bold tracking-[0.05em] text-on-primary uppercase transition-colors hover:bg-primary"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Create Notice
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-unit-md">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notices by title..."
          className="h-9 min-w-[220px] flex-1 rounded-lg border border-border-light bg-surface-container-lowest px-4 text-body-md text-on-surface shadow-sm transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
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

      <NoticeTable notices={filteredNotices} onToggleStatus={toggleNoticeStatus} />

      <p className="text-label-md text-on-surface-variant">
        Showing {filteredNotices.length} of {notices.length} notices
      </p>
    </>
  )
}
