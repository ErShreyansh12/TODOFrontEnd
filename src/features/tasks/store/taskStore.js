import { create } from 'zustand'
import { INITIAL_TASKS } from '@/features/tasks/data/board-tasks.data'

export const useTaskStore = create((set) => ({
  tasks: INITIAL_TASKS,
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    })),
  updateTask: (taskId, values) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...values } : task)),
    })),
  setDelayReason: (taskId, delayReason) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, delayReason } : task)),
    })),
}))
