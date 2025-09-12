import { Customer } from '@/services/data-generator'
import { SelectFilterItem, SelectOptionItem } from '@/types'
import { TableColumns } from '@/types/table'
import {
  getLastDaysOfPreviousMonth,
  getLastDaysOfTwoPreviousMonths,
  getLastSaturdayISO,
  getSaturdayOfTwoWeeksAgo,
  getYesterday
} from '@/utils/date'

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

export const lastSeenGteOptions: SelectFilterItem[] = [
  {
    label: 'Today',
    value: {
      last_seen_gte: getYesterday(),
      last_seen_lte: ''
    }
  },
  {
    label: 'This week',
    value: {
      last_seen_gte:
        getLastSaturdayISO() === getYesterday()
          ? new Date(new Date(getLastSaturdayISO()).getTime() + 1).toISOString()
          : getLastSaturdayISO(),
      last_seen_lte: ''
    }
  },
  {
    label: 'Last week',
    value: {
      last_seen_gte: getSaturdayOfTwoWeeksAgo(),
      last_seen_lte: getLastSaturdayISO()
    }
  },
  {
    label: 'This month',
    value: {
      last_seen_gte: getLastDaysOfPreviousMonth(),
      last_seen_lte: ''
    }
  },
  {
    label: 'Last month',
    value: {
      last_seen_gte: getLastDaysOfTwoPreviousMonths(),
      last_seen_lte: getLastDaysOfPreviousMonth()
    }
  },
  {
    label: 'Earlier',
    value: {
      last_seen_gte: '',
      last_seen_lte: getLastDaysOfTwoPreviousMonths()
    }
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
    isVisible: true,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Orders',
    id: 'nb_orders',
    isVisible: true,
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
    isVisible: true,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'News',
    id: 'has_newsletter',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Segments',
    id: 'groups',
    isVisible: true,
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

export const DEFAULT_PAGE_CUSTOMER = 1
export const DEFAULT_PER_PAGE_CUSTOMER = 25
