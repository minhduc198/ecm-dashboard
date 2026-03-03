import { SelectFilterItem, SelectOptionItem } from '@/types'
import { TableColumns } from '@/types/table'
import { Product } from '../types'

export const salesOptions: SelectFilterItem[] = [
  {
    label: 'best_sellers',
    value: {
      sales_gt: 25
    }
  },
  {
    label: 'average',
    value: {
      sales_gt: 10,
      sales_lte: 25
    }
  },
  {
    label: 'low',
    value: {
      sales_gt: 0,
      sales_lte: 10
    }
  },
  {
    label: 'never_sold',
    value: { sales: 0 }
  }
]

export const stockOptions: SelectFilterItem[] = [
  {
    label: 'out_of_stock',
    value: {
      stock: 0
    }
  },
  {
    label: 'items_1_9',
    value: {
      stock_lt: 10,
      stock_gt: 0
    }
  },
  {
    label: 'items_10_49',
    value: {
      stock_lt: 50,
      stock_gt: 9
    }
  },
  {
    label: 'items_50_more',
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

export enum SortByEnum {
  REFERENCE_DESC = 'REFERENCE_DESC',
  REFERENCE_ASC = 'REFERENCE_ASC',
  SALES_DESC = 'SALES_DESC',
  SALES_ASC = 'SALES_ASC',
  STOCK_DESC = 'STOCK_DESC',
  STOCK_ASC = 'STOCK_ASC'
}

export enum TabProduct {
  IMAGE = 'image',
  DETAILS = 'details',
  DESCRIPTION = 'description',
  REVIEWS = 'reviews'
}

export const initialProductColumns: TableColumns<Product>[] = [
  {
    label: 'Reference',
    id: 'reference',
    isVisible: true,
    numeric: false,
    disablePadding: true
  },
  {
    label: 'Price',
    id: 'price',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Width',
    id: 'width',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Height',
    id: 'height',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },

  {
    label: 'Stock',
    id: 'stock',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Sales',
    id: 'sales',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: '',
    id: 'category_id',
    isVisible: true,
    numeric: false,
    disablePadding: false
  }
]
