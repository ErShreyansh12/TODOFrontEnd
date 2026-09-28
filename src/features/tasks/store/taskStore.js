import { create } from 'zustand'

export const useTaskStore = create((set) => ({
  tasks: [],
  // Seeded exactly once from GET /tasks (see useSyncedTasks) so a later-mounting
  // page never re-fetches and clobbers local-only edits already applied here.
  tasksLoaded: false,
  setTasks: (tasks) => set({ tasks, tasksLoaded: true }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
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
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, delayReason, delayReasonAt: new Date().toISOString() } : task,
      ),
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
}))
