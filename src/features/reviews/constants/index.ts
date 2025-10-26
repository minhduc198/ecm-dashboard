import { Review } from '@/services/data-generator'
import { TableColumns } from '@/types/table'

export const initialReviewColumns: TableColumns<Review>[] = [
  {
    label: 'Date',
    id: 'date',
    isVisible: true,
    numeric: false,
    disablePadding: true
  },
  {
    label: 'Customer',
    id: 'customer_id',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Rating',
    id: 'rating',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Product',
    id: 'product_id',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },

  {
    label: 'Comment',
    id: 'comment',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Status',
    id: 'status',
    isVisible: true,
    numeric: false,
    disablePadding: false
  }
]
