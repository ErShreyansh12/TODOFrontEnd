import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addMeetingSchema } from '@/features/schedule/schemas/meeting.schema'
import { useCreateMeeting } from '@/hooks/useMeetings'

// One modal for both adding and editing a meeting. Passing `meeting` puts it in edit mode: the fields
// start filled in and Save hands the new values to `onSave` instead of creating a new meeting.
export default function AddMeetingModal({ defaultDate, meeting, onClose, onAdd, onSave }) {
  const isEdit = Boolean(meeting)
  const createMeeting = useCreateMeeting()
  const [submitError, setSubmitError] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addMeetingSchema),
    defaultValues: isEdit
      ? {
          title: meeting.title,
          date: meeting.date,
          startTime: meeting.startTime24,
          endTime: meeting.endTime24,
          location: meeting.location ?? '',
          description: meeting.description ?? '',
        }
      : { title: '', date: defaultDate, startTime: '', endTime: '', location: '', description: '' },
  })

  const onSubmit = async (values) => {
    setSubmitError(null)
    const payload = {
      title: values.title.trim(),
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      location: values.location.trim(),
      description: values.description?.trim() || undefined,
    }

    try {
      if (isEdit) {
        await onSave(payload)
      } else {
        const response = await createMeeting.mutateAsync(payload)
        onAdd(response.data.meeting)
      }
      onClose()
    } catch (error) {
      // The modal stays open so nothing typed is lost.
      setSubmitError(
        error?.response?.data?.message ??
          error?.message ??
          (isEdit ? 'Unable to save the meeting. Please try again.' : 'Unable to add the meeting. Please try again.'),
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-xl">
        <div className="flex items-center justify-between border-b border-border-light p-unit-lg">
          <h2 className="font-[var(--font-headline)] text-headline-sm text-on-surface">
            {isEdit ? 'Edit Meeting' : 'Add Meeting'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-unit-lg p-unit-lg">
          <div className="space-y-2">
            <label htmlFor="meetingTitle" className="block text-label-bold font-bold text-on-surface">
              Meeting Title <span className="text-error">*</span>
            </label>
            <input
              id="meetingTitle"
              type="text"
              placeholder="e.g., Sprint Planning"
              className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface placeholder-outline transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('title')}
            />
            {errors.title && <p className="text-sm text-error">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="meetingDate" className="block text-label-bold font-bold text-on-surface">
              Date <span className="text-error">*</span>
            </label>
            <input
              id="meetingDate"
              type="date"
              className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('date')}
            />
            {errors.date && <p className="text-sm text-error">{errors.date.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-unit-lg md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="meetingStart" className="block text-label-bold font-bold text-on-surface">
                Start Time <span className="text-error">*</span>
              </label>
              <input
                id="meetingStart"
                type="time"
                className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
                {...register('startTime')}
              />
              {errors.startTime && <p className="text-sm text-error">{errors.startTime.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="meetingEnd" className="block text-label-bold font-bold text-on-surface">
                End Time <span className="text-error">*</span>
              </label>
              <input
                id="meetingEnd"
                type="time"
                className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
                {...register('endTime')}
              />
              {errors.endTime && <p className="text-sm text-error">{errors.endTime.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="meetingLocation" className="block text-label-bold font-bold text-on-surface">
              Location <span className="text-error">*</span>
            </label>
            <input
              id="meetingLocation"
              type="text"
              placeholder="e.g., Conference Room A or a meeting link"
              className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface placeholder-outline transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('location')}
            />
            {errors.location && <p className="text-sm text-error">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="meetingDescription" className="block text-label-bold font-bold text-on-surface">
              Description
            </label>
            <textarea
              id="meetingDescription"
              rows={3}
              placeholder="Add any notes or agenda details for this meeting..."
              className="w-full resize-y rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface placeholder-outline transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('description')}
            />
          </div>

          {submitError && <p className="text-sm text-error">{submitError}</p>}

          <div className="flex justify-end gap-3 border-t border-border-light pt-unit-lg">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-light bg-transparent px-6 py-2.5 text-label-bold font-bold text-on-surface-variant transition-colors hover:bg-surface-subtle hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-2.5 text-label-bold font-bold text-on-primary shadow-sm transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[18px]">{isEdit ? 'check' : 'add_circle'}</span>
              {isSubmitting ? (isEdit ? 'Saving…' : 'Adding…') : isEdit ? 'Save Changes' : 'Add Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
