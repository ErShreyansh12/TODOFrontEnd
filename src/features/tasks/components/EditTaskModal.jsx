import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editTaskSchema } from '@/features/tasks/schemas/edit-task.schema'
import { STAFF_OPTIONS, TIMELINE_OPTIONS, PRIORITY_OPTIONS } from '@/features/tasks/data/task-options.data'
import SelectField from '@/features/tasks/components/SelectField'
import CustomDatesField from '@/features/tasks/components/CustomDatesField'

export default function EditTaskModal({ task, onClose, onSave }) {
  const [attachmentRemoved, setAttachmentRemoved] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      broker: task.broker ?? '',
      assignedTo: task.assignedTo,
      timeline: task.timeline,
      customDates: task.customDates ?? [],
      dueDate: task.dueDate,
      priority: task.priority,
    },
  })

  const timeline = watch('timeline')

  const onSubmit = (values) => {
    const { attachment: newAttachment, ...rest } = values
    const attachment =
      newAttachment && newAttachment.length > 0
        ? { name: newAttachment[0].name }
        : attachmentRemoved
          ? null
          : (task.attachment ?? null)

    onSave(task.id, { ...rest, attachment })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-xl">
        <div className="flex items-center justify-between border-b border-border-light p-unit-lg">
          <h2 className="font-[var(--font-headline)] text-headline-sm text-on-surface">Edit Task</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-unit-lg overflow-y-auto p-unit-lg"
        >
          <div className="space-y-2">
            <label htmlFor="editTaskTitle" className="block text-label-bold font-bold text-on-surface">
              Task Title <span className="text-error">*</span>
            </label>
            <input
              id="editTaskTitle"
              type="text"
              className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('title')}
            />
            {errors.title && <p className="text-sm text-error">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="editTaskDescription" className="block text-label-bold font-bold text-on-surface">
              Description
            </label>
            <textarea
              id="editTaskDescription"
              rows={3}
              className="w-full resize-y rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="editTaskAttachment" className="block text-label-bold font-bold text-on-surface">
              {task.attachment && !attachmentRemoved ? 'Replace attachment' : 'Add attachment'}
            </label>
            {task.attachment && !attachmentRemoved && (
              <div className="flex items-center justify-between gap-2 rounded-lg border border-border-light bg-surface-subtle px-4 py-2">
                <span className="flex items-center gap-2 text-body-md text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">description</span>
                  Current: {task.attachment.name}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachmentRemoved(true)}
                  className="text-label-md font-bold text-error hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
            <input
              id="editTaskAttachment"
              type="file"
              className="block w-full cursor-pointer rounded-lg border border-border-light bg-surface-subtle text-body-md text-on-surface-variant file:mr-4 file:rounded-lg file:border-0 file:bg-secondary-container file:px-4 file:py-2 file:text-body-md file:font-semibold file:text-on-secondary-container hover:file:bg-secondary-fixed"
              {...register('attachment')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="editTaskBroker" className="block text-label-bold font-bold text-on-surface">
              Broker
            </label>
            <input
              id="editTaskBroker"
              type="text"
              placeholder="e.g., Broker or agency name"
              className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('broker')}
            />
          </div>

          <div className="h-px w-full bg-border-light" />

          <SelectField
            label="Assigned To"
            required
            options={STAFF_OPTIONS}
            error={errors.assignedTo?.message}
            {...register('assignedTo')}
          />

          <SelectField
            label="Timeline"
            required
            options={TIMELINE_OPTIONS}
            error={errors.timeline?.message}
            {...register('timeline')}
          />

          {timeline === 'custom' && <CustomDatesField control={control} register={register} errors={errors} />}

          <div className="space-y-2">
            <label htmlFor="editTaskDueDate" className="block text-label-bold font-bold text-on-surface">
              Due Date <span className="text-error">*</span>
            </label>
            <input
              id="editTaskDueDate"
              type="date"
              className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('dueDate')}
            />
            {errors.dueDate && <p className="text-sm text-error">{errors.dueDate.message}</p>}
          </div>

          <div className="space-y-3">
            <span className="block text-label-bold font-bold text-on-surface">Priority Level</span>
            <div className="flex gap-4">
              {PRIORITY_OPTIONS.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2">
                  <input type="radio" value={option.value} className={option.accentClass} {...register('priority')} />
                  <span className="text-body-md text-on-surface">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

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
              <span className="material-symbols-outlined text-[18px]">check</span>
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
