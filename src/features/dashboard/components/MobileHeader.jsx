import { useAuthStore } from '@/store/authStore'
import { Role } from '@/constants/roles'

export default function MobileHeader({ onMenuClick }) {
  const user = useAuthStore((state) => state.user)
  const isStaff = user?.role === Role.STAFF

  return (
    <header className="fixed top-0 left-0 z-30 flex w-full items-center justify-between border-b border-border-light bg-surface-container-lowest px-margin-mobile py-unit-sm shadow-sm md:hidden">
      <div className="font-[var(--font-headline)] text-headline-sm font-bold text-primary">
        {isStaff ? 'Staff Portal' : 'Admin Portal'}
      </div>
      <button type="button" onClick={onMenuClick} className="text-on-surface-variant" aria-label="Open menu">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  )
}
