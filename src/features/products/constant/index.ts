import { SelectFilterItem, SelectOptionItem } from '@/types'

export const salesOptions: SelectFilterItem[] = [
  {
    label: 'Best sellers',
    value: {
      sales_gt: 25
    }
  },
  {
    label: 'Average',
    value: {
      sales_gt: 10,
      sales_lte: 25
    }
  },
  {
    label: 'Low',
    value: {
      sales_gt: 0,
      sales_lte: 10
    }
  },
  {
    label: 'Never sold',
    value: { sales: 0 }
  }
]

export const stockOptions: SelectFilterItem[] = [
  {
    label: 'Out of stock',
    value: {
      stock: 0
    }
  },
  {
    label: '1 - 9 items',
    value: {
      stock_lt: 10,
      stock_gt: 0
    }
  },
  {
    label: '10 - 49 items',
    value: {
      stock_lt: 50,
      stock_gt: 9
    }
  },
  {
    label: '50 items & more',
    value: {
      stock_gt: 49
    }
  }
]

export const categoryOptions: SelectOptionItem[] = [
  {
    label: 'Animals',
    value: 0
  },
  {
    label: 'Beard',
    value: 1
  },
  {
    label: 'Business',
    value: 2
  },
  {
    label: 'Cars',
    value: 3
  },
  {
    label: 'City',
    value: 4
  },
  {
    label: 'Flowers',
    value: 5
  },
  {
    label: 'Food',
    value: 6
  },
  {
    label: 'Nature',
    value: 7
  },
  {
    label: 'People',
    value: 8
  },
  {
    label: 'Sports',
    value: 9
  },
  {
    label: 'Tech',
    value: 10
  },
  {
    label: 'Travel',
    value: 11
  },
  {
    label: 'Water',
    value: 12
  }
]

export const DEFAULT_PER_PAGE_PRODUCT = 25

export const sortName = {
  REFERENCE: 'Reference',
  SALES: 'Sales',
  STOCK: 'Stock'
}

export const sortOrder = {
  DESC: 'descending',
  ASC: 'ascending'
}
