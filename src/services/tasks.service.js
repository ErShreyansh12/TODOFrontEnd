import { apiClient } from '@/services/apiClient'

const buildTaskFormData = ({ customDates, attachment, ...fields }) => {
  const formData = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, value)
  })
  if (customDates?.length) formData.append('customDates', JSON.stringify(customDates))
  if (attachment) formData.append('attachment', attachment)

  return formData
}

export const tasksService = {
  create: (payload) => apiClient.post('/tasks', buildTaskFormData(payload)).then((res) => res.data),
  list: ({ page = 1, limit = 50 } = {}) =>
    apiClient.get('/tasks', { params: { page, limit } }).then((res) => res.data),
  updateStatus: (taskId, status) =>
    apiClient.patch(`/tasks/${taskId}/status`, { status }).then((res) => res.data),
  // PUT replaces the task's editable fields wholesale — a field left out of the
  // payload is cleared server-side, EXCEPT attachment: omitting it preserves the
  // existing file (the API has no way to remove an attachment once set, only
  // replace it), so buildTaskFormData only appends it when a new file is chosen.
  update: (taskId, payload) => apiClient.put(`/tasks/${taskId}`, buildTaskFormData(payload)).then((res) => res.data),
  remove: (taskId) => apiClient.delete(`/tasks/${taskId}`).then((res) => res.data),
}
