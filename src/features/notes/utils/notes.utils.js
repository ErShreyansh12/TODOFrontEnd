export const stripHtml = (html) => {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
}

export const countWords = (html) => {
  const text = stripHtml(html)
  return text ? text.split(/\s+/).length : 0
}

export const countChars = (html) => stripHtml(html).length

export const formatRelativeTimestamp = (isoString, now = new Date()) => {
  const date = new Date(isoString)
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return 'Updated just now'
  if (diffMinutes < 60) return `Updated ${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`

  const isSameDay = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  if (isSameDay) return `Today, ${timeLabel}`
  if (isYesterday) return `Yesterday, ${timeLabel}`

  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export const formatFullTimestamp = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
