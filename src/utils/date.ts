import { format, parseISO } from 'date-fns'

export function formatDate(date: string, formatStr: string) {
  if (!date) return null
  return format(new Date(date), formatStr)
}
