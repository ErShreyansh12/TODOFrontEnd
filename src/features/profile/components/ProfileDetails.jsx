import StatusChip from '@/features/staff/components/StatusChip'

const EMPTY_VALUE = '—'

const formatMemberSince = (value) => {
  if (!value) return EMPTY_VALUE
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return EMPTY_VALUE
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const getInitials = (name) =>
  (name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?'

function DetailRow({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-label-md font-bold tracking-[0.05em] text-on-surface-variant uppercase">{label}</dt>
      <dd className="mt-unit-xs text-body-md break-words text-on-surface">{children || EMPTY_VALUE}</dd>
    </div>
  )
}

// Read-only view of the signed-in staff member's own details. Nothing here is editable.
export default function ProfileDetails({ user }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm">
      <div className="flex flex-col gap-unit-md border-b border-border-light bg-surface-subtle p-unit-lg sm:flex-row sm:items-center">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary-container bg-secondary-container font-[var(--font-headline)] text-headline-sm text-on-secondary-container"
        >
          {getInitials(user?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-[var(--font-headline)] text-headline-md text-on-surface">
            {user?.name || EMPTY_VALUE}
          </h3>
          <p className="text-body-md text-on-surface-variant">{user?.staffId ?? EMPTY_VALUE}</p>
        </div>
        {user?.status && <StatusChip status={user.status} />}
      </div>

      <dl className="grid grid-cols-1 gap-x-unit-lg gap-y-unit-lg p-unit-lg sm:grid-cols-2">
        <DetailRow label="First name">{user?.firstName}</DetailRow>
        <DetailRow label="Last name">{user?.lastName}</DetailRow>
        <DetailRow label="Staff ID">{user?.staffId}</DetailRow>
        <DetailRow label="Role">Staff</DetailRow>
        <DetailRow label="Email">{user?.email}</DetailRow>
        <DetailRow label="Phone">{user?.phone}</DetailRow>
        <DetailRow label="Member since">{formatMemberSince(user?.createdAt)}</DetailRow>
      </dl>

      <p className="flex items-center gap-2 border-t border-border-light px-unit-lg py-unit-md text-label-md text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px]">lock</span>
        Your details are managed by your administrator. Contact them if something needs to change.
      </p>
    </section>
  )
}
