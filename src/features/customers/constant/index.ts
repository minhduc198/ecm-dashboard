import { SelectOptionItem } from '@/types'

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
