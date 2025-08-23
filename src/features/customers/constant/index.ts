import { Customer } from '@/services/data-generator'
import { SelectOptionItem } from '@/types'
import { TableColumns } from '@/types/table'

export enum NEWSLETTER {
  Y = 'Y',
  N = 'N',
  ALL = ''
}

export const segmentsOptions: SelectOptionItem[] = [
  { value: 'compulsive', label: 'Compulsive' },
  { value: 'collector', label: 'Collector' },
  { value: 'ordered_once', label: 'Ordered once' },
  { value: 'regular', label: 'Regular' },
  { value: 'returns', label: 'Returns' },
  { value: 'reviewer', label: 'Reviewer' }
]

export const lastSeenGteOptions: SelectOptionItem[] = [
  {
    label: 'Today',
    value: 'today'
  },
  {
    label: 'This week',
    value: 'this_week'
  },
  {
    label: 'Last week',
    value: 'last_week'
  },
  {
    label: 'This month',
    value: 'this_month'
  },
  {
    label: 'Last month',
    value: 'last_month'
  },
  {
    label: 'Earlier',
    value: 'earlier'
  }
]

export const hasOrderedOptions: SelectOptionItem[] = [
  { value: '1', label: 'Yes' },
  { value: '0', label: 'No' }
]

export const hasNewsletterOptions: SelectOptionItem[] = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' }
]

export const initialCustomerColumns: TableColumns<Customer>[] = [
  {
    label: 'Name',
    id: 'first_name',
    isVisible: true,
    numeric: false,
    disablePadding: true
  },
  {
    label: 'Last seen',
    id: 'last_seen',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Orders',
    id: 'nb_orders',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Total spent',
    id: 'total_spent',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },

  {
    label: 'Latest purchase',
    id: 'latest_purchase',
    isVisible: false,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'News',
    id: 'has_newsletter',
    isVisible: false,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Segments',
    id: 'groups',
    isVisible: false,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Birthday',
    id: 'birthday',
    isVisible: false,
    numeric: false,
    disablePadding: false
  }
]
