import { Invoice } from '@/services/data-generator'
import { TableColumns } from '@/types/table'
import { InvoiceFilterItem } from '../types'

export const DEFAULT_PER_PAGE_INVOICE = 25
export const DEFAULT_PER_INVOICE = 1

export const initialInvoiceColumns: TableColumns<Invoice>[] = [
  {
    label: 'Id',
    id: 'id',
    isVisible: true,
    numeric: false,
    disablePadding: true
  },
  {
    label: 'Invoice date',
    id: 'date',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Customer',
    id: 'customer_id',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Address',
    id: 'customer_detail',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },

  {
    label: 'Order',
    id: 'reference',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Total ex taxes',
    id: 'total_ex_taxes',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Delivery fees',
    id: 'delivery_fees',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Taxes',
    id: 'taxes',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Total',
    id: 'total',
    isVisible: true,
    numeric: true,
    disablePadding: false
  }
]

export const initFilterInvoiceItems: InvoiceFilterItem[] = [
  {
    label: 'Customer',
    key: 'customer_id',
    isChecked: false
  },
  {
    label: 'Order',
    key: 'order_id',
    isChecked: false
  }
]
