import MetricCard from '@/features/dashboard/components/MetricCard'
import StatusCard from '@/features/dashboard/components/StatusCard'
import StaffSummaryTable from '@/features/dashboard/components/StaffSummaryTable'
import ProductivityChart from '@/features/dashboard/components/ProductivityChart'
import { METRICS, STATUS_BREAKDOWN, STAFF_SUMMARY, OVERALL_PRODUCTIVITY } from '@/features/dashboard/data/overview.data'

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col justify-between gap-unit-md md:flex-row md:items-end">
        <div>
          <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
            Overview
          </h2>
          <p className="text-body-lg text-on-surface-variant">System performance and staff metrics for today.</p>
        </div>
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xl text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Search tasks, staff..."
            className="w-64 rounded-lg border border-border-light bg-surface-container-lowest py-2 pr-4 pl-10 text-body-md shadow-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-unit-md md:grid-cols-4 md:gap-gutter">
        {METRICS.map(({ key, ...metric }) => (
          <MetricCard key={key} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-unit-md md:grid-cols-4">
        {STATUS_BREAKDOWN.map(({ key, ...status }) => (
          <StatusCard key={key} {...status} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-margin-desktop lg:grid-cols-3">
        <StaffSummaryTable staff={STAFF_SUMMARY} />
        <ProductivityChart percentage={OVERALL_PRODUCTIVITY} />
      </div>
    </>
  )
}
