import { useAuthStore } from '@/store/authStore'
import ProfileDetails from '@/features/profile/components/ProfileDetails'
import ChangePasswordForm from '@/features/profile/components/ChangePasswordForm'

export default function StaffProfile() {
  const user = useAuthStore((state) => state.user)

  return (
    <>
      <div>
        <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
          Profile
        </h2>
        <p className="text-body-lg text-on-surface-variant">View your details and manage your password.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-margin-desktop xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ProfileDetails user={user} />
        </div>
        <div className="xl:col-span-2">
          <ChangePasswordForm />
        </div>
      </div>
    </>
  )
}
