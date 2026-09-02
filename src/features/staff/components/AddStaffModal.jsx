import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addStaffSchema } from '@/features/staff/schemas/staff.schema'

export default function AddStaffModal({ onClose, onAdd }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addStaffSchema),
    defaultValues: { name: '', email: '', designation: '', department: '' },
  })

  const onSubmit = (values) => {
    onAdd(values)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-xl">
        <div className="flex items-center justify-between border-b border-border-light p-unit-lg">
          <h2 className="font-[var(--font-headline)] text-headline-sm text-on-surface">Add Staff Member</h2>
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
            <label htmlFor="staffName" className="block text-label-bold font-bold text-on-surface">
              Full Name <span className="text-error">*</span>
            </label>
            <input
              id="staffName"
              type="text"
              placeholder="e.g., Priya Nair"
              className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface placeholder-outline transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('name')}
            />
            {errors.name && <p className="text-sm text-error">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="staffEmail" className="block text-label-bold font-bold text-on-surface">
              Email <span className="text-error">*</span>
            </label>
            <input
              id="staffEmail"
              type="email"
              placeholder="e.g., priya.nair@taskmaster.pro"
              className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface placeholder-outline transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-error">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-unit-lg md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="staffDesignation" className="block text-label-bold font-bold text-on-surface">
                Designation <span className="text-error">*</span>
              </label>
              <input
                id="staffDesignation"
                type="text"
                placeholder="e.g., UX Researcher"
                className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface placeholder-outline transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
                {...register('designation')}
              />
              {errors.designation && <p className="text-sm text-error">{errors.designation.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="staffDepartment" className="block text-label-bold font-bold text-on-surface">
                Department <span className="text-error">*</span>
              </label>
              <input
                id="staffDepartment"
                type="text"
                placeholder="e.g., Design"
                className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface placeholder-outline transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
                {...register('department')}
              />
              {errors.department && <p className="text-sm text-error">{errors.department.message}</p>}
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
              {isSubmitting ? 'Adding…' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
