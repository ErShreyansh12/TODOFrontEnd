import { apiClient } from '@/services/apiClient'
import { Role } from '@/constants/roles'
import { STAFF_MEMBERS } from '@/features/staff/data/staff.data'

// TODO: remove once the real authentication API is available.
const STATIC_ADMIN_CREDENTIALS = {
  identifier: 'admin@gmail.com',
  password: 'Admin@321',
}

const STATIC_STAFF_CREDENTIALS = {
  identifier: 'EMP-042',
  password: '123456',
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

    if (identifier === STATIC_STAFF_CREDENTIALS.identifier && password === STATIC_STAFF_CREDENTIALS.password) {
      const staffMember = STAFF_MEMBERS.find((member) => member.id === STATIC_STAFF_CREDENTIALS.identifier)
      return Promise.resolve({
        data: {
          user: {
            id: staffMember.id,
            name: `${staffMember.firstName} ${staffMember.lastName}`,
            email: staffMember.email,
            role: Role.STAFF,
          },
          token: 'static-staff-token',
        },
      })
    }

    return apiClient.post('/auth/login', { identifier, password }).then((res) => res.data)
  },
}
