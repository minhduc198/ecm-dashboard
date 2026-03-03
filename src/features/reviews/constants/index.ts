import { Review } from '@/services/data-generator'
import { SelectOptionItem } from '@/types'
import { TableColumns } from '@/types/table'
import { REVIEW_STATUS, ReviewFilterItem } from '../types'

export const initialReviewColumns: TableColumns<Review>[] = [
  {
    label: 'date',
    id: 'date',
    isVisible: true,
    numeric: false,
    disablePadding: true,
    sortable: true
  },
  {
    label: 'customer',
    id: 'customer_id',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  },
  {
    label: 'rating',
    id: 'rating',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  },
  {
    label: 'product',
    id: 'product_id',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  },

  {
    label: 'comment',
    id: 'comment',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  },
  {
    label: 'status',
    id: 'status',
    isVisible: true,
    numeric: false,
    disablePadding: false,
    sortable: true
  }
]

export const initFilterReviewItems: ReviewFilterItem[] = [
  { label: 'status', key: 'status', isChecked: false },
  {
    label: 'customer',
    key: 'customer_id',
    isChecked: false
  },
  {
    label: 'product',
    key: 'product_id',
    isChecked: false
  },
  {
    label: 'posted_since',
    key: 'date_lte',
    isChecked: false
  },
  {
    label: 'posted_before',
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
