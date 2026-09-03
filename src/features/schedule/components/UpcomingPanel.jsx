import EventListItem from '@/features/schedule/components/EventListItem'

export default function UpcomingPanel({ meetings, deadlines }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border-light p-unit-md">
        <h3 className="flex items-center gap-2 font-[var(--font-headline)] text-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-primary">event_upcoming</span>
          Upcoming
        </h3>
      </div>
      <div className="flex-1 space-y-unit-md overflow-y-auto p-unit-md">
        {meetings.length === 0 && <p className="text-body-md text-on-surface-variant">No upcoming meetings.</p>}
        {meetings.map((event) => (
          <EventListItem key={event.id} event={event} />
        ))}

        {deadlines.length > 0 && (
          <>
            <hr className="my-2 border-border-light" />
            <h4 className="mb-2 text-label-bold font-bold tracking-[0.05em] text-on-surface-variant uppercase">
              Upcoming Deadlines
            </h4>
            <div className="space-y-unit-md">
              {deadlines.map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
