import EventListItem from '@/features/schedule/components/EventListItem'

// Meetings that haven't started yet (today and the next two days), straight from GET /meetings/upcoming.
export default function UpcomingPanel({ meetings, isLoading, isError, onEditMeeting, onDeleteMeeting }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border-light p-unit-md">
        <h3 className="flex items-center gap-2 font-[var(--font-headline)] text-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-primary">event_upcoming</span>
          Upcoming
        </h3>
        <p className="mt-1 text-label-md text-on-surface-variant">Today and the next two days</p>
      </div>
      <div className="flex-1 space-y-unit-md overflow-y-auto p-unit-md">
        {isLoading && <p className="text-body-md text-on-surface-variant">Loading meetings…</p>}
        {isError && !isLoading && (
          <p className="text-body-md text-error">Couldn't load upcoming meetings. Please refresh the page.</p>
        )}
        {!isLoading && !isError && meetings.length === 0 && (
          <p className="text-body-md text-on-surface-variant">No upcoming meetings.</p>
        )}
        {!isLoading &&
          !isError &&
          meetings.map((event) => (
            <EventListItem key={event.id} event={event} onEdit={onEditMeeting} onDelete={onDeleteMeeting} />
          ))}
      </div>
    </div>
  )
}
