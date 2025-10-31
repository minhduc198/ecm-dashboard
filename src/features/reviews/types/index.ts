import { Review } from '@/services/data-generator'
import { ApiResponse, ApiResponseList, FilterItem, SORT, UrlQuery } from '@/types'
import { TableColumns } from '@/types/table'

export interface GetReviewListRequest {
  pagination: {
    page: number
    perPage: number
  }
  sort?: {
    field: string
    order: SORT
  }
  filter?: {
    status?: REVIEW_STATUS
    customer_id?: string
    product_id?: string
    posted_since?: string
    posted_before?: string
  }
}

export type GetReviewsListResponse = ApiResponseList<Review>

export type DeleteReviewsRequest = {
  ids: number[]
}
export type DeleteReviewsResponse = ApiResponse<Review>

export interface GetReviewDetailRequest {
  id: number
}

export type GetReviewDetailResponse = ApiResponse<Review>

export interface ReviewParam {
  id?: number[]
  q: string
  date_lte: string
  date_gte: string
  customer_id: string
  product_id: string
  status: REVIEW_STATUS
}

export type ReviewUrlQuery = UrlQuery<ReviewParam>
export type ReviewFilterItem = FilterItem<ReviewParam>

export interface CreateReviewRequest {
  data: Partial<Omit<Review, 'id'>>
}

export enum REVIEW_STATUS {
  'ACCEPTED' = 'accepted',
  'REJECTED' = 'rejected',
  'PENDING' = 'pending'
}

export type TableColumnsReview = TableColumns<Review>[]
