import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { changePasswordSchema, NEW_PASSWORD_MIN_LENGTH } from '@/features/profile/schemas/changePassword.schema'
import { useChangePassword } from '@/hooks/useAuth'

// A password input with its own show/hide toggle.
function PasswordField({ label, error, autoComplete, registration, ...props }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Input
      label={label}
      type={isVisible ? 'text' : 'password'}
      autoComplete={autoComplete}
      error={error}
      rightElement={
        <button
          type="button"
          onClick={() => setIsVisible((value) => !value)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline hover:text-on-surface-variant focus:outline-none"
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          <span className="material-symbols-outlined text-[20px]">{isVisible ? 'visibility' : 'visibility_off'}</span>
        </button>
      }
      {...props}
      {...registration}
    />
  )
}

export default function ChangePasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState(null)
  const changePassword = useChangePassword()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const clearNotice = () => {
    setIsSuccess(false)
    setApiError(null)
  }

  const onSubmit = async (values) => {
    clearNotice()

    try {
      await changePassword.mutateAsync(values)
      reset()
      setIsSuccess(true)
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Unable to change the password. Please try again.'
      // The API answers rule failures with a 422; show each one on the field it is about:
      // "Current password is incorrect." and "New password must be different from the current password."
      if (error?.response?.status === 422 && /different from/i.test(message)) {
        setError('newPassword', { type: 'server', message })
      } else if (error?.response?.status === 422 && /current password is incorrect/i.test(message)) {
        setError('currentPassword', { type: 'server', message })
      } else {
        setApiError(message)
      }
    }
  }

  return (
    <section className="rounded-xl border border-border-light bg-surface-container-lowest shadow-sm">
      <div className="border-b border-border-light p-unit-lg">
        <h3 className="flex items-center gap-2 font-[var(--font-headline)] text-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-primary">key</span>
          Change Password
        </h3>
        <p className="mt-1 text-label-md text-on-surface-variant">
          Your new password must be at least {NEW_PASSWORD_MIN_LENGTH} characters long.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-unit-lg p-unit-lg">
        <PasswordField
          label="Current Password"
          autoComplete="current-password"
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          registration={register('currentPassword', { onChange: clearNotice })}
        />

        <PasswordField
          label="New Password"
          autoComplete="new-password"
          placeholder={`At least ${NEW_PASSWORD_MIN_LENGTH} characters`}
          error={errors.newPassword?.message}
          registration={register('newPassword', { deps: ['confirmPassword'], onChange: clearNotice })}
        />

        <PasswordField
          label="Confirm New Password"
          autoComplete="new-password"
          placeholder="Re-enter the new password"
          error={errors.confirmPassword?.message}
          registration={register('confirmPassword', { onChange: clearNotice })}
        />

        {isSuccess && (
          <p
            role="status"
            className="flex items-start gap-2 rounded-lg border border-border-light bg-surface-subtle p-unit-md text-body-md text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
            Your password has been changed. You've been signed out of your other devices.
          </p>
        )}

        {apiError && (
          <p role="alert" className="text-sm text-error">
            {apiError}
          </p>
        )}

        <Button type="submit" icon="lock_reset" isLoading={changePassword.isPending}>
          Update Password
        </Button>
      </form>
    </section>
  )
}
