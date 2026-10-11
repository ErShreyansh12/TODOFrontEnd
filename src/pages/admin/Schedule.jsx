import { useMemo, useState } from 'react'
import MonthGrid from '@/features/schedule/components/MonthGrid'
import WeekView from '@/features/schedule/components/WeekView'
import DayView from '@/features/schedule/components/DayView'
import UpcomingPanel from '@/features/schedule/components/UpcomingPanel'
import AddMeetingModal from '@/features/schedule/components/AddMeetingModal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Pagination from '@/components/common/Pagination'
import { useDeleteMeeting, useMeetingsList, useUpcomingMeetings, useUpdateMeeting } from '@/hooks/useMeetings'
import { mapApiMeeting } from '@/features/schedule/utils/meeting.utils'
import {
  addDays,
  addMonths,
  canChangeMeeting,
  canDeleteMeeting,
  formatFullDate,
  formatMonthLabel,
  formatWeekRangeLabel,
  getMonthMatrix,
  getViewRange,
  getWeekDates,
  toDateKey,
} from '@/features/schedule/utils/calendar.utils'

const VIEW_OPTIONS = ['month', 'week', 'day']
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100]
const DEFAULT_PAGE_SIZE = 30
const UPCOMING_LIMIT = 30
const today = new Date()

// "2026-10-20" -> Date for that local day.
const dateFromKey = (key) => {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export default function Schedule() {
  const [view, setView] = useState('month')
  const [currentDate, setCurrentDate] = useState(today)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [meetingToEdit, setMeetingToEdit] = useState(null)
  const [meetingToDelete, setMeetingToDelete] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const updateMeeting = useUpdateMeeting()
  const deleteMeeting = useDeleteMeeting()

  // The window being looked at: the whole month, the Monday-Sunday week, or the single day. It is what is
  // sent as from/to, so changing view or stepping prev/next re-reads the list for that window.
  const range = useMemo(() => getViewRange(view, currentDate), [view, currentDate])

  // The page belongs to one window + page size; when either changes it falls back to page 1 without an
  // effect (the stored key no longer matches).
  const listKey = `${range.from}|${range.to}|${limit}`
  const [pageState, setPageState] = useState({ key: listKey, page: 1 })
  const page = pageState.key === listKey ? pageState.page : 1
  const setPage = (nextPage) => setPageState({ key: listKey, page: nextPage })

  const { data, isLoading, isError, isPlaceholderData, refetch } = useMeetingsList({
    from: range.from,
    to: range.to,
    page,
    limit,
  })
  const upcoming = useUpcomingMeetings({ limit: UPCOMING_LIMIT })

  const events = useMemo(() => (data?.data ?? []).map(mapApiMeeting), [data])
  const pagination = data?.pagination

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      acc[event.date] = acc[event.date] ? [...acc[event.date], event] : [event]
      return acc
    }, {})
  }, [events])

  const upcomingMeetings = useMemo(() => (upcoming.data?.data ?? []).map(mapApiMeeting), [upcoming.data])

  const firstShown = pagination && events.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0
  const lastShown = firstShown > 0 ? firstShown + events.length - 1 : 0

  const weeks = useMemo(() => getMonthMatrix(currentDate), [currentDate])
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate])

  const label = useMemo(() => {
    if (view === 'month') return formatMonthLabel(currentDate)
    if (view === 'week') return formatWeekRangeLabel(weekDates)
    return formatFullDate(currentDate)
  }, [view, currentDate, weekDates])

  const handlePrev = () => {
    if (view === 'month') setCurrentDate((date) => addMonths(date, -1))
    else if (view === 'week') setCurrentDate((date) => addDays(date, -7))
    else setCurrentDate((date) => addDays(date, -1))
  }

  const handleNext = () => {
    if (view === 'month') setCurrentDate((date) => addMonths(date, 1))
    else if (view === 'week') setCurrentDate((date) => addDays(date, 7))
    else setCurrentDate((date) => addDays(date, 1))
  }

  const handleToday = () => setCurrentDate(new Date())

  // The time rules are checked again at the moment of saving/deleting, because the edit form or the
  // confirmation can sit open while the start time approaches.
  const assertStillChangeable = (meeting) => {
    if (!canChangeMeeting(meeting)) {
      throw new Error('This meeting can no longer be edited — it starts in less than 15 minutes, has started or has ended.')
    }
  }

  // A meeting can be deleted until 15 minutes before it starts, and again once it has ended.
  const assertStillDeletable = (meeting) => {
    if (!canDeleteMeeting(meeting)) {
      throw new Error("This meeting can't be deleted right now — it starts in less than 15 minutes or is in progress.")
    }
  }

  // Moving the only meeting on the last page away (or deleting it) would leave that page empty, so step
  // back one page.
  const stepBackIfPageWouldEmpty = () => {
    if (page > 1 && events.length === 1) setPage(page - 1)
  }

  // `values` is the edit form's payload (24-hour HH:mm times, like the API). Saves through PUT
  // /meetings/{id}; the mutation then re-reads the meetings list, so the calendar shows exactly what the
  // server holds. If the server refuses (past date, inside the 15-minute window, unknown meeting...) this
  // throws and the modal shows the server's message.
  const handleSaveMeeting = async (values) => {
    assertStillChangeable(meetingToEdit)
    const dateChanged = values.date !== meetingToEdit.date
    await updateMeeting.mutateAsync({ meetingId: meetingToEdit.id, payload: values })
    if (dateChanged) stepBackIfPageWouldEmpty()
  }

  const openDeleteConfirm = (meeting) => {
    setDeleteError(null)
    setMeetingToDelete(meeting)
  }

  // Deletes through DELETE /meetings/{id}; the mutation then re-reads the meetings list. If the server
  // refuses (inside the 15-minute window or in progress, already deleted...) the dialog stays open and shows the
  // server's message.
  const handleConfirmDelete = async () => {
    setDeleteError(null)
    try {
      assertStillDeletable(meetingToDelete)
      await deleteMeeting.mutateAsync(meetingToDelete.id)
      stepBackIfPageWouldEmpty()
      setMeetingToDelete(null)
    } catch (error) {
      setDeleteError(error?.response?.data?.message ?? error?.message ?? 'Unable to delete the meeting. Please try again.')
    }
  }

  const handleSelectDate = (date) => {
    setCurrentDate(date)
    setView('day')
  }

  const handlePageSizeChange = (event) => {
    setLimit(Number(event.target.value))
  }

  // `meeting` is the record the API saved. The list re-reads itself; if the new meeting falls outside the
  // window being shown, the calendar moves to its date so it doesn't seem to have vanished.
  const handleAddMeeting = (meeting) => {
    if (meeting.date < range.from || meeting.date > range.to) {
      setCurrentDate(dateFromKey(meeting.date))
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-unit-md md:flex-row md:items-end">
        <div>
          <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
            Schedule &amp; Meetings
          </h2>
          <p className="text-body-lg text-on-surface-variant">Manage team calendar and meetings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-unit-sm">
          <div className="flex items-center overflow-hidden rounded-lg border border-border-light bg-surface-container-lowest p-1 shadow-sm">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={`rounded px-4 py-1.5 text-label-bold font-bold capitalize transition-colors ${
                  view === option
                    ? 'bg-surface-container text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-subtle'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-unit-md py-unit-sm text-label-bold font-bold tracking-[0.05em] text-on-primary uppercase transition-colors hover:bg-primary"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Add Meeting
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-margin-desktop lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border-light bg-surface-subtle p-unit-md">
            <div className="flex items-center gap-unit-sm">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous"
                className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <h3 className="w-40 text-center font-[var(--font-headline)] text-headline-sm text-on-surface sm:w-56">
                {label}
              </h3>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next"
                className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleToday}
              className="text-label-bold font-bold text-primary hover:underline"
            >
              Today
            </button>
          </div>

          {isError && (
            <div className="flex flex-wrap items-center gap-2 border-b border-border-light bg-surface-subtle px-unit-md py-unit-sm text-body-md text-error">
              Couldn't load the meetings for this period.
              <button type="button" onClick={() => refetch()} className="font-bold underline">
                Try again
              </button>
            </div>
          )}
          {isLoading && (
            <p className="border-b border-border-light px-unit-md py-unit-sm text-body-md text-on-surface-variant">
              Loading meetings…
            </p>
          )}

          <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            {view === 'month' && (
              <MonthGrid
                weeks={weeks}
                monthDate={currentDate}
                today={today}
                selectedDate={currentDate}
                eventsByDate={eventsByDate}
                onSelectDate={handleSelectDate}
              />
            )}
            {view === 'week' && (
              <WeekView
                weekDates={weekDates}
                today={today}
                eventsByDate={eventsByDate}
                onSelectDate={handleSelectDate}
              />
            )}
            {view === 'day' && (
              <DayView
                date={currentDate}
                eventsByDate={eventsByDate}
                onEditMeeting={setMeetingToEdit}
                onDeleteMeeting={openDeleteConfirm}
              />
            )}
          </div>

          <div className="flex flex-col items-center justify-between gap-unit-sm border-t border-border-light bg-surface-subtle p-unit-md sm:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-unit-sm">
              <select
                value={limit}
                onChange={handlePageSizeChange}
                aria-label="Meetings per page"
                className="h-9 rounded-lg border border-border-light bg-surface-container-lowest px-3 text-body-md text-on-surface shadow-sm transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
              <p className="text-label-md text-on-surface-variant">
                {pagination && pagination.total > 0
                  ? `Showing ${firstShown}–${lastShown} of ${pagination.total} ${
                      pagination.total === 1 ? 'meeting' : 'meetings'
                    }`
                  : isLoading
                    ? ''
                    : 'No meetings in this period'}
              </p>
            </div>
            {pagination && (pagination.totalPages > 1 || page > 1) && (
              <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm">
          <UpcomingPanel
            meetings={upcomingMeetings}
            isLoading={upcoming.isLoading}
            isError={upcoming.isError}
            onEditMeeting={setMeetingToEdit}
            onDeleteMeeting={openDeleteConfirm}
          />
        </div>
      </div>

      {isAddModalOpen && (
        <AddMeetingModal
          defaultDate={toDateKey(currentDate)}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddMeeting}
        />
      )}

      {meetingToEdit && (
        <AddMeetingModal
          key={meetingToEdit.id}
          meeting={meetingToEdit}
          onClose={() => setMeetingToEdit(null)}
          onSave={handleSaveMeeting}
        />
      )}

      {meetingToDelete && (
        <ConfirmDialog
          title="Delete Meeting"
          description={`Are you sure you want to delete "${meetingToDelete.title}" on ${formatFullDate(
            dateFromKey(meetingToDelete.date),
          )}${meetingToDelete.startTime ? ` at ${meetingToDelete.startTime}` : ''}? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          cancelLabel="No"
          error={deleteError}
          isConfirming={deleteMeeting.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setMeetingToDelete(null)}
        />
      )}
    </>
  )
}
