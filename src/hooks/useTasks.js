import { useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { tasksService } from '@/services/tasks.service'
import { useTaskStore } from '@/features/tasks/store/taskStore'
import { mapApiTask } from '@/features/tasks/utils/task.utils'

export const useCreateTask = () =>
  useMutation({
    mutationFn: tasksService.create,
  })

export const useUpdateTaskStatus = () =>
  useMutation({
    mutationFn: ({ taskId, status }) => tasksService.updateStatus(taskId, status),
  })

export const useUpdateTask = () =>
  useMutation({
    mutationFn: ({ taskId, payload }) => tasksService.update(taskId, payload),
  })

export const useDeleteTask = () =>
  useMutation({
    mutationFn: (taskId) => tasksService.remove(taskId),
  })

const useTasksListQuery = () =>
  useQuery({
    queryKey: ['tasks', 'list', { page: 1, limit: 50 }],
    queryFn: () => tasksService.list({ page: 1, limit: 50 }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

// Fetches GET /tasks once and seeds the shared task store from it, then returns
// the store's live (possibly locally-edited) tasks. Any page that needs the
// task list should use this instead of reading useTaskStore directly, so the
// list is always loaded no matter which page is entered first.
export const useSyncedTasks = () => {
  const query = useTasksListQuery()
  const tasks = useTaskStore((state) => state.tasks)
  const tasksLoaded = useTaskStore((state) => state.tasksLoaded)
  const setTasks = useTaskStore((state) => state.setTasks)

  useEffect(() => {
    if (query.data?.data && !tasksLoaded) {
      setTasks(query.data.data.map(mapApiTask))
    }
  }, [query.data, tasksLoaded, setTasks])

  return {
    tasks,
    isLoading: query.isLoading && !tasksLoaded,
    isError: query.isError && !tasksLoaded,
    error: query.error,
  }
}
