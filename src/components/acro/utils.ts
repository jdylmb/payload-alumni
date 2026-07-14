export const formatDate = (value?: string | null): string => {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  announcement: 'Announcement',
  event: 'Event',
  achievement: 'Achievement',
  general: 'General',
}

export const categoryLabel = (value?: string | null): string =>
  (value && CATEGORY_LABELS[value]) || 'News'
