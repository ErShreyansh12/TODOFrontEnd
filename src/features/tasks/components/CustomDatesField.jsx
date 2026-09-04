import { useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'

const TODAY_ISO_DATE = new Date().toISOString().slice(0, 10)

export default function CustomDatesField({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'customDates' })

  useEffect(() => {
    if (fields.length === 0) {
      append({ date: '' })
    }
  }, [fields.length, append])

  return (
    <div className="space-y-2">
      <span className="block text-label-bold font-bold text-on-surface">
        Select Dates <span className="text-error">*</span>
      </span>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="date"
                min={TODAY_ISO_DATE}
                className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
                {...register(`customDates.${index}.date`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                aria-label="Remove date"
                className="shrink-0 rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>
            </div>
            {errors.customDates?.[index]?.date && (
              <p className="text-sm text-error">{errors.customDates[index].date.message}</p>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ date: '' })}
        className="flex items-center gap-1 text-label-bold font-bold text-primary hover:underline"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        Add Date
      </button>
      {(errors.customDates?.message || errors.customDates?.root?.message) && (
        <p className="text-sm text-error">{errors.customDates.message ?? errors.customDates.root?.message}</p>
      )}
    </div>
  )
}
