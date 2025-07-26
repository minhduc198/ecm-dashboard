import { Order } from '@/services/data-generator'
import { ReactNode } from 'react'

export interface TableColumns<T> {
  disablePadding?: boolean
  id: keyof T
  label: string
  numeric?: boolean
  cellRender: (value: ReactNode, row: TableColumns<T>) => React.ReactNode
}
