import { Review } from '@/services/data-generator'
import { SelectOptionItem } from '@/types'
import { TableColumns } from '@/types/table'
import { REVIEW_STATUS, ReviewFilterItem } from '../types'

export const initialReviewColumns: TableColumns<Review>[] = [
  {
    label: 'Date',
    id: 'date',
    isVisible: true,
    numeric: false,
    disablePadding: true,
    sortable: true
  },
  {
    label: 'Customer',
    id: 'customer_id',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  },
  {
    label: 'Rating',
    id: 'rating',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  },
  {
    label: 'Product',
    id: 'product_id',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  },

  {
    label: 'Comment',
    id: 'comment',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  },
  {
    label: 'Status',
    id: 'status',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  }
]

export const initFilterReviewItems: ReviewFilterItem[] = [
  { label: 'Status', key: 'status', isChecked: false },
  {
    label: 'Customer',
    key: 'customer_id',
    isChecked: false
  },
  {
    label: 'Product',
    key: 'product_id',
    isChecked: false
  },
  {
    label: 'Posted since',
    key: 'date_lte',
    isChecked: false
  },
  {
    label: 'Posted before',
    key: 'date_gte',
    isChecked: false
  }
]

export const optionStatus: SelectOptionItem[] = [
  {
    label: 'Accepted',
    value: 'accepted'
  },
  {
    label: 'Pending',
    value: 'pending'
  },
  {
    label: 'Rejected',
    value: 'rejected'
  }
]

export const featureReviewStatus = {
  accepted: REVIEW_STATUS.ACCEPTED,
  rejected: REVIEW_STATUS.REJECTED,
  pending: REVIEW_STATUS.PENDING
}
