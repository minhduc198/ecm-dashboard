import { TableColumns } from '@/types/table'
import { Order, OrderFilterItem } from '../types'
import { useTranslation } from 'react-i18next'

export const initFilterItems: OrderFilterItem[] = [
  {
    label: 'Customer',
    key: 'customer_id',
    isChecked: false
  },
  {
    label: 'Passed Since',
    key: 'date_gte',
    isChecked: false
  },
  {
    label: 'Passed Before',
    key: 'date_lte',
    isChecked: false
  },
  {
    label: 'Min amount',
    key: 'total_gte',
    isChecked: false
  },
  {
    label: 'Returned',
    key: 'returned',
    isChecked: false
  }
]

export const initialColumns: TableColumns<Order>[] = [
  {
    label: 'Customers',
    id: 'customer',
    isVisible: true,
    numeric: false,
    disablePadding: true
  },
  {
    label: 'Date',
    id: 'date',
    isVisible: false,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Reference',
    id: 'reference',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },

  {
    label: 'Address',
    id: 'address',
    isVisible: false,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Nb items',
    id: 'nb_items',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Total ex taxes',
    id: 'total_ex_taxes',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Delivery fees',
    id: 'delivery_fees',
    isVisible: false,
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

export const returnedColumn: TableColumns<Order> = {
  label: 'Returned',
  id: 'returned',
  isVisible: true,
  numeric: true,
  disablePadding: false
}
