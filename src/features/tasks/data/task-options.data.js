export const STAFF_OPTIONS = [
  { value: 'rahul', label: 'Rahul Sharma' },
  { value: 'amit', label: 'Amit Patel' },
  { value: 'neha', label: 'Neha Gupta' },
]

export const TIMELINE_OPTIONS = [
  { value: 'daily', label: 'Daily (Mon-Fri)' },
  { value: 'saturday', label: 'Every Saturday' },
  { value: '16th', label: '16th of every month' },
  { value: '1st', label: '1st of every month' },
  { value: 'custom', label: 'Custom Dates (Lump sum days)' },
  { value: 'monthly', label: 'Monthly' },
]

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'scheduled', label: 'Scheduled' },
]

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', accentClass: 'accent-status-scheduled' },
  { value: 'medium', label: 'Medium', accentClass: 'accent-status-pending' },
  { value: 'high', label: 'High', accentClass: 'accent-status-delayed' },
]
