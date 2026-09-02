import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'

export const useLogin = () => {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setSession(data.data.user, data.data.token)
    },
  })
}
