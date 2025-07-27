import { ReactNode } from 'react'

export interface TableColumns<T> {
  id: keyof T
  label: string
  numeric?: boolean
  disablePadding?: boolean
  cell?: (value: unknown, row: T) => ReactNode
}
