import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { createTaskSchema } from '@/features/tasks/schemas/task.schema'
import { STAFF_OPTIONS, TIMELINE_OPTIONS, STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/features/tasks/data/task-options.data'
import { ROUTES } from '@/constants/routes'
import SelectField from '@/features/tasks/components/SelectField'

export default function CreateTaskForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      timeline: '',
      priority: 'medium',
      status: 'pending',
    },
  })

  const onSubmit = (values) => {
    // TODO: wire up to the tasks API once it exists — for now the task is only logged.
    console.info('Task created', values)
    navigate(ROUTES.ADMIN_DASHBOARD)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-unit-lg p-unit-lg md:p-margin-desktop">
      <div className="grid grid-cols-1 gap-unit-lg">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-label-bold font-bold text-on-surface">
            Task Title <span className="text-error">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Q3 Financial Audit Prep"
            className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface placeholder-outline transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
            {...register('title')}
          />
          {errors.title && <p className="text-sm text-error">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-label-bold font-bold text-on-surface">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Provide detailed instructions and context for this task..."
            className="w-full resize-y rounded-lg border border-border-light bg-surface-subtle px-4 py-3 text-body-md text-on-surface placeholder-outline transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
            {...register('description')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="attachment" className="block text-label-bold font-bold text-on-surface">
            Add attachment
          </label>
          <input
            id="attachment"
            type="file"
            className="block w-full cursor-pointer rounded-lg border border-border-light bg-surface-subtle text-body-md text-on-surface-variant file:mr-4 file:rounded-lg file:border-0 file:bg-secondary-container file:px-4 file:py-2 file:text-body-md file:font-semibold file:text-on-secondary-container hover:file:bg-secondary-fixed"
            {...register('attachment')}
          />
        </div>
      </div>

      <div className="h-px w-full bg-border-light" />

      <div className="grid grid-cols-1 gap-unit-lg md:grid-cols-2">
        <SelectField
          label="Assigned To"
          required
          placeholder="Select Staff Member"
          options={STAFF_OPTIONS}
          error={errors.assignedTo?.message}
          {...register('assignedTo')}
        />
        <SelectField
          label="Timeline"
          required
          placeholder="Select Timeline"
          options={TIMELINE_OPTIONS}
          error={errors.timeline?.message}
          {...register('timeline')}
        />
      </div>

      <div className="grid grid-cols-1 gap-unit-lg md:grid-cols-2">
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

        <SelectField
          label="Initial Status"
          options={STATUS_OPTIONS}
          containerClassName="md:w-1/2"
          error={errors.status?.message}
          {...register('status')}
        />
      </div>

      <div className="flex flex-col items-center justify-end gap-4 border-t border-border-light pt-unit-lg md:flex-row">
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          className="w-full rounded-lg border border-border-light bg-transparent px-6 py-2.5 text-label-bold font-bold text-on-surface-variant transition-colors hover:bg-surface-subtle hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-border-light md:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-2.5 text-label-bold font-bold text-on-primary shadow-sm transition-colors hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">check</span>
          {isSubmitting ? 'Creating…' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
