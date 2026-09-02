export default function MobileHeader({ onMenuClick }) {
  return (
    <header className="fixed top-0 left-0 z-30 flex w-full items-center justify-between border-b border-border-light bg-surface-container-lowest px-margin-mobile py-unit-sm shadow-sm md:hidden">
      <div className="font-[var(--font-headline)] text-headline-sm font-bold text-primary">Admin Portal</div>
      <button type="button" onClick={onMenuClick} className="text-on-surface-variant" aria-label="Open menu">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  )
}
