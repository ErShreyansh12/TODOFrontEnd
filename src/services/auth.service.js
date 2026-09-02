import { apiClient } from '@/services/apiClient'
import { Role } from '@/constants/roles'

// TODO: remove once the real authentication API is available.
const STATIC_ADMIN_CREDENTIALS = {
  identifier: 'admin@gmail.com',
  password: 'Admin@321',
}

export const authService = {
  login: ({ identifier, password }) => {
    if (identifier === STATIC_ADMIN_CREDENTIALS.identifier && password === STATIC_ADMIN_CREDENTIALS.password) {
      return Promise.resolve({
        data: {
          user: { id: 'admin-1', name: 'Admin', email: identifier, role: Role.ADMIN },
          token: 'static-admin-token',
        },
      })
    }

    return apiClient.post('/auth/login', { identifier, password }).then((res) => res.data)
  },
}
