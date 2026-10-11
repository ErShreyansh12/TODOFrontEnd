import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'

export const useLogout = () =>
  useMutation({
    mutationFn: authService.logout,
  })

// Changing the password hands back a new token. It is stored straight away, so this device stays signed in
// while every other device is signed out.
export const useChangePassword = () => {
  const updateToken = useAuthStore((state) => state.updateToken)

  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (response) => {
      if (response?.data?.token) updateToken(response.data.token)
    },
  })
}

export const useLogin = () => {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setSession(data.data.user, data.data.token)
    },
  })
}
