import { create } from 'zustand'
import { getToken, setToken, clearToken, getUser, setUser, clearUser } from '@/utils/storage'

export const useAuthStore = create((set) => ({
  user: getUser(),
  token: getToken(),
  isAuthenticated: Boolean(getToken()),
  setSession: (user, token) => {
    setToken(token)
    setUser(user)
    set({ user, token, isAuthenticated: true })
  },
  // Swaps in a new token for the same signed-in user (after a password change).
  updateToken: (token) => {
    setToken(token)
    set({ token, isAuthenticated: true })
  },
  logout: () => {
    clearToken()
    clearUser()
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
