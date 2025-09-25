import { ReactNode } from 'react'

export interface TableColumns<T> {
  id: keyof T
  label: string
  numeric?: boolean
  disablePadding?: boolean
  sortable?: boolean
  isVisible?: boolean
  sortBy?: string
  minWidth?: number
  width?: number
  cell?: (value: unknown, row: T) => ReactNode
}
