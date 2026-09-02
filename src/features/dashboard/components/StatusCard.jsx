export default function StatusCard({ label, value, borderClass, textClass }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border-t-4 bg-surface-container-lowest px-unit-md py-unit-sm shadow-sm ${borderClass}`}
    >
      <span className="text-label-bold font-bold tracking-[0.05em] text-on-surface-variant uppercase">{label}</span>
      <span className={`font-[var(--font-headline)] text-headline-sm ${textClass}`}>{value}</span>
    </div>
  )
}
