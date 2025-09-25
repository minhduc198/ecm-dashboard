import { SelectFilterItem, SORT } from '@/types'

export const salesOptions: SelectFilterItem[] = [
  {
    label: 'Best sellers',
    value: 'best_sellers'
  },
  {
    label: 'Average',
    value: 'average'
  },
  {
    label: 'Low',
    value: 'low'
  },
  {
    label: 'Never sold',
    value: 'never_sold'
  }
]

export const stockOptions: SelectFilterItem[] = [
  {
    label: 'Out of stock',
    value: 'out_of_stock'
  },
  {
    label: '1 - 9 items',
    value: '1_9_items'
  },
  {
    label: '10 - 49 items',
    value: '10_49_items'
  },
  {
    label: '50 items & more',
    value: 'more_50'
  }
]

export const categoryOptions: SelectFilterItem[] = [
  {
    label: 'Animals',
    value: 'animal'
  },
  {
    label: 'Beard',
    value: 'beard'
  },
  {
    label: 'Business',
    value: 'business'
  },
  {
    label: 'Cars',
    value: 'cars'
  },
  {
    label: 'City',
    value: 'city'
  },
  {
    label: 'Flowers',
    value: 'flowers'
  },
  {
    label: 'Food',
    value: 'food'
  }
]

export interface GetProductListRequest {
  pagination: {
    page: number
    perPage: number
  }
  sort?: {
    field: string
    order: SORT
  }
  filter?: {
    sale?: string
    stock?: string
    categories?: string
    q?: string
  }
}

export const DEFAULT_PER_PAGE_PRODUCT = 24
