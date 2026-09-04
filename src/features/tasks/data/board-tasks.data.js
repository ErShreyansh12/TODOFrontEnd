const today = new Date()

const dateOffset = (days) => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Prepare onboarding docs',
    description: 'Write the week-one checklist for new engineering hires.',
    assignedTo: 'admin',
    priority: 'medium',
    status: 'todo',
    dueDate: dateOffset(9),
    timeline: 'daily',
    attachment: null,
  },
  {
    id: 'task-2',
    title: 'Update client contract template',
    description: 'Add the revised SLA clause reviewed by legal last week.',
    assignedTo: 'rahul',
    priority: 'low',
    status: 'todo',
    dueDate: dateOffset(12),
    timeline: 'monthly',
    attachment: { name: 'contract-template-v3.docx' },
  },
  {
    id: 'task-3',
    title: 'Redesign dashboard charts',
    description: 'Swap the bar charts for the new sparkline components.',
    assignedTo: 'admin',
    priority: 'high',
    status: 'in_progress',
    dueDate: dateOffset(6),
    timeline: '1st',
    attachment: { name: 'chart-mockups.pdf' },
  },
  {
    id: 'task-4',
    title: 'QA regression pass',
    description: "Full pass on the release-9.4 branch before Friday's cut.",
    assignedTo: 'neha',
    priority: 'medium',
    status: 'in_progress',
    dueDate: dateOffset(8),
    timeline: 'saturday',
    attachment: null,
  },
  {
    id: 'task-5',
    title: 'Fix login bug',
    description: 'Intermittent session drop reported by QA on Android.',
    assignedTo: 'admin',
    priority: 'high',
    status: 'in_progress',
    dueDate: dateOffset(-3),
    timeline: 'custom',
    customDates: [{ date: dateOffset(-3) }, { date: dateOffset(4) }],
    attachment: { name: 'crash-log.txt' },
  },
  {
    id: 'task-6',
    title: 'Vendor invoice reconciliation',
    description: 'Match September vendor invoices against PO records.',
    assignedTo: 'amit',
    priority: 'low',
    status: 'todo',
    dueDate: dateOffset(-2),
    timeline: '16th',
    attachment: null,
  },
  {
    id: 'task-7',
    title: 'Migrate database schema',
    description: 'Applied migration 0042 to production, verified row counts.',
    assignedTo: 'admin',
    priority: 'high',
    status: 'completed',
    dueDate: dateOffset(-3),
    timeline: 'daily',
    attachment: null,
  },
  {
    id: 'task-8',
    title: 'Draft Q3 marketing report',
    description: 'Summarized campaign performance for the leadership sync.',
    assignedTo: 'neha',
    priority: 'medium',
    status: 'completed',
    dueDate: dateOffset(-2),
    timeline: 'monthly',
    attachment: { name: 'q3-report-draft.pdf' },
  },
]
