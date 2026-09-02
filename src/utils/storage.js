const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))

export const clearUser = () => localStorage.removeItem(USER_KEY)
