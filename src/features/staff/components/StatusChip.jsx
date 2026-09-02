export default function StatusChip({ status }) {
  const isActive = status === 'active'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-label-bold font-bold ${
        isActive ? 'bg-status-completed/10 text-status-completed' : 'bg-secondary/10 text-secondary'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-status-completed' : 'bg-secondary'}`} />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}
