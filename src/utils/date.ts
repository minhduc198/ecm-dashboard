import { endOfMonth, format, previousSaturday, subDays, subMonths } from 'date-fns'

export function formatDate(date?: string, formatStr = 'd/M/yyyy') {
  if (!date) return null
  return format(new Date(date), formatStr)
}

function normalizeToUTCPlus7(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 17))
  return d.toISOString()
}

export function getLastDaysOfPreviousMonth(): string {
  const now = new Date()
  const lastMonth = endOfMonth(subMonths(now, 1))
  return normalizeToUTCPlus7(lastMonth)
}

export function getLastDaysOfTwoPreviousMonths(): string {
  const now = new Date()
  const twoMonthsAgo = endOfMonth(subMonths(now, 2))
  return normalizeToUTCPlus7(twoMonthsAgo)
}

export function getYesterday(): string {
  const now = new Date()
  const yesterday = subDays(now, 1)
  return normalizeToUTCPlus7(yesterday)
}

export function getSaturdayOfTwoWeeksAgo(): string {
  const now = new Date()
  const lastWeek = subDays(now, 7)
  const saturdayTwoWeeksAgo = previousSaturday(lastWeek)
  return normalizeToUTCPlus7(saturdayTwoWeeksAgo)
}

export function getLastSaturdayISO(): string {
  const now = new Date()
  const lastSaturday = previousSaturday(now)
  return normalizeToUTCPlus7(lastSaturday)
}
