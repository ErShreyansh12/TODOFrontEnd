import { apiClient } from '@/services/apiClient'

export const meetingsService = {
  // Meetings dated from..to (both YYYY-MM-DD, at most 42 days apart), in date/time order, paged.
  list: ({ from, to, page = 1, limit = 30 }) =>
    apiClient.get('/meetings', { params: { from, to, page, limit } }).then((res) => res.data),
  // Meetings that haven't started yet, from now until the end of the day after tomorrow.
  upcoming: ({ page = 1, limit = 30 } = {}) =>
    apiClient.get('/meetings/upcoming', { params: { page, limit } }).then((res) => res.data),
  // Body: { title, date: 'YYYY-MM-DD', startTime: 'HH:mm', endTime: 'HH:mm', location, description? }
  create: (payload) => apiClient.post('/meetings', payload).then((res) => res.data),
  // Same body as create; the server applies the same rules and also refuses a meeting that is less than
  // 15 minutes from starting (or already started).
  update: (meetingId, payload) => apiClient.put(`/meetings/${meetingId}`, payload).then((res) => res.data),
  // Soft delete; refused (409) once the meeting is less than 15 minutes from starting, like an edit.
  remove: (meetingId) => apiClient.delete(`/meetings/${meetingId}`).then((res) => res.data),
}
