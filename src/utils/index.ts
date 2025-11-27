import { format } from 'date-fns'

export function formatDateTime(dateData: string, formatPattern: string) {
  return format(new Date(dateData), formatPattern)
}

export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key in obj) {
    const value = obj[key]
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value
    }
  }
  return result
}

export function isoStringToDate(isoString?: string): Date | null {
  if (!isoString) return null
  return new Date(isoString)
}

export const reorderDnd = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export function clearLocalStorage() {
  localStorage.removeItem('access_token')
  window.dispatchEvent(new CustomEvent('clearLS'))
}
