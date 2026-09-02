import { Outlet } from 'react-router-dom'
import { APP_CONFIG } from '@/config/app.config'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      <div className="flex flex-grow flex-col">
        <Outlet />
      </div>
      <footer className="border-border-light/50 bg-surface-container-lowest/50 relative z-10 border-t py-unit-md backdrop-blur-sm">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-unit-sm px-margin-mobile md:flex-row md:px-margin-desktop">
          <p className="text-label-md text-on-surface-variant">
            © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex gap-unit-md">
            <a href="#help" className="text-label-md text-on-surface-variant hover:text-primary">
              Help Center
            </a>
            <a href="#terms" className="text-label-md text-on-surface-variant hover:text-primary">
              Terms of Service
            </a>
            <a href="#privacy" className="text-label-md text-on-surface-variant hover:text-primary">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
