import EventListItem from '@/features/schedule/components/EventListItem'
import { formatFullDate, toDateKey } from '@/features/schedule/utils/calendar.utils'

export default function DayView({ date, eventsByDate }) {
  const dayEvents = eventsByDate[toDateKey(date)] ?? []

  return (
    <div className="p-unit-md">
      <h3 className="mb-unit-md font-[var(--font-headline)] text-headline-sm text-on-surface">
        {formatFullDate(date)}
      </h3>
      {dayEvents.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">No meetings or deadlines scheduled for this day.</p>
      ) : (
        <div className="space-y-unit-md">
          {dayEvents.map((event) => (
            <EventListItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
