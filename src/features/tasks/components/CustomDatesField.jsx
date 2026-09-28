const TODAY_ISO_DATE = new Date().toISOString().slice(0, 10)

export default function CustomDatesField({ register, errors }) {
  return (
    <div className="space-y-2">
      <label htmlFor="customDate" className="block text-label-bold font-bold text-on-surface">
        Select Date <span className="text-error">*</span>
      </label>
      <input
        id="customDate"
        type="date"
        min={TODAY_ISO_DATE}
        className="w-full rounded-lg border border-border-light bg-surface-subtle px-4 py-2 text-body-md text-on-surface transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
        {...register('customDates.0.date')}
      />
      {errors.customDates?.[0]?.date && <p className="text-sm text-error">{errors.customDates[0].date.message}</p>}
      {(errors.customDates?.message || errors.customDates?.root?.message) && (
        <p className="text-sm text-error">{errors.customDates.message ?? errors.customDates.root?.message}</p>
      )}
    </div>
  )
}
