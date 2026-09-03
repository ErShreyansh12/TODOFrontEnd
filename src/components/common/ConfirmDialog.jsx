export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  confirmIcon = 'delete',
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-xl">
        <div className="p-unit-lg">
          <div className="flex items-start gap-unit-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-container text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div>
              <h2 className="font-[var(--font-headline)] text-headline-sm text-on-surface">{title}</h2>
              <p className="mt-1 text-body-md text-on-surface-variant">{description}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-border-light p-unit-lg pt-unit-md">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border-light bg-transparent px-6 py-2.5 text-label-bold font-bold text-on-surface-variant transition-colors hover:bg-surface-subtle hover:text-on-surface"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 rounded-lg bg-error px-6 py-2.5 text-label-bold font-bold text-on-error shadow-sm transition-colors hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">{confirmIcon}</span>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
