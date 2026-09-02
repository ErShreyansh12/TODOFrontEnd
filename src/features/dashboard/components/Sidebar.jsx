import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'

const NAV_LINKS = [
  { label: 'Dashboard', icon: 'dashboard', to: ROUTES.ADMIN_DASHBOARD },
  { label: 'Task Board', icon: 'assignment' },
  { label: 'Staff Directory', icon: 'group' },
  { label: 'Schedule', icon: 'calendar_month' },
  { label: 'Private Notes', icon: 'sticky_note_2' },
  { label: 'Reports', icon: 'analytics' },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <nav
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border-light bg-surface-container-lowest shadow-md transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-border-light p-margin-mobile md:p-margin-desktop">
          <div className="mb-unit-lg flex items-center justify-between gap-unit-sm">
            <div className="flex min-w-0 items-center gap-unit-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary-container bg-secondary-container text-on-secondary-container">
                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
              </div>
              <div className="min-w-0">
                <h1 className="truncate font-[var(--font-headline)] text-headline-sm text-primary">Admin Portal</h1>
                <p className="truncate text-label-md text-on-surface-variant">{user?.name ?? 'Management Suite'}</p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 text-on-surface-variant md:hidden"
              onClick={onClose}
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              navigate(ROUTES.ADMIN_TASKS_CREATE)
              onClose()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-unit-md py-unit-sm text-label-bold font-bold tracking-[0.05em] text-on-primary uppercase transition-colors hover:bg-primary"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create New Task
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-unit-sm py-unit-md">
          <ul className="space-y-unit-sm">
            {NAV_LINKS.map((link) =>
              link.to ? (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-unit-md rounded-xl p-unit-md text-label-bold font-bold tracking-[0.05em] transition-all ${
                        isActive
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'text-secondary hover:bg-surface-container'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined text-xl" data-weight="fill">
                      {link.icon}
                    </span>
                    {link.label}
                  </NavLink>
                </li>
              ) : (
                <li key={link.label}>
                  <a
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    className="flex items-center gap-unit-md rounded-xl p-unit-md text-label-bold font-bold tracking-[0.05em] text-secondary transition-all hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-xl">{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="border-t border-border-light p-unit-sm">
          <ul className="space-y-unit-xs">
            <li>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="flex items-center gap-unit-md rounded-lg p-unit-sm text-label-bold font-bold tracking-[0.05em] text-secondary transition-all hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-lg">help</span>
                Help Center
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-unit-md rounded-lg p-unit-sm text-label-bold font-bold tracking-[0.05em] text-tertiary transition-all hover:bg-error-container hover:text-on-error-container"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
