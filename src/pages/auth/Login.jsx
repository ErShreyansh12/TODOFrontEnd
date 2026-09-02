import LoginForm from '@/features/auth/components/LoginForm'
import { APP_CONFIG } from '@/config/app.config'
import loginHero from '@/assets/images/login-hero.jpg'

export default function Login() {
  return (
    <main className="relative flex flex-grow items-center justify-center overflow-hidden p-margin-mobile md:p-margin-desktop">
      <div className="pointer-events-none absolute top-0 right-0 -mt-32 -mr-32 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-48 -ml-48 h-[800px] w-[800px] rounded-full bg-secondary-container/20 blur-[120px]" />

      <div className="relative z-10 grid w-full max-w-[1000px] items-center gap-unit-xl md:grid-cols-2">
        <div className="hidden h-full flex-col justify-center pr-gutter md:flex">
          <div className="mb-unit-lg">
            <span
              className="material-symbols-outlined text-[48px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dataset
            </span>
          </div>
          <h1 className="mb-unit-sm font-[var(--font-headline)] text-display-lg text-on-surface">
            {APP_CONFIG.name}
          </h1>
          <p className="max-w-md text-body-lg text-on-surface-variant">{APP_CONFIG.tagline}</p>

          <div className="border-border-light mt-unit-xl relative h-[300px] w-full overflow-hidden rounded-2xl border shadow-sm">
            <img
              src={loginHero}
              alt="Abstract 3D composition of geometric shapes representing organized task management"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="glass-panel mx-auto w-full max-w-md rounded-2xl p-margin-mobile shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-margin-desktop">
          <div className="mb-unit-lg text-center md:hidden">
            <span
              className="material-symbols-outlined mb-unit-xs text-[40px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dataset
            </span>
            <h1 className="font-[var(--font-headline)] text-headline-lg-mobile text-on-surface">
              {APP_CONFIG.name}
            </h1>
          </div>

          <div className="mb-unit-lg text-center md:text-left">
            <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-md text-on-surface">
              Welcome Back
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Please enter your credentials to access the portal.
            </p>
          </div>

          <LoginForm />

          <div className="border-border-light mt-unit-lg border-t pt-unit-md text-center">
            <p className="flex items-center justify-center gap-1 text-label-md text-outline">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              Secure Administrative Access
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
