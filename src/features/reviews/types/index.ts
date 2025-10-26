import { Review } from '@/services/data-generator'
import { ApiResponse, ApiResponseList, SORT, UrlQuery } from '@/types'
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
    status?: string
    customer_id?: number
    product_id?: number
    posted_since?: string
    posted_before?: string
  }
}

export type GetReviewsListResponse = ApiResponseList<Review>

export type DeleteReviewsRequest = {
  ids: number[]
}
export type DeleteReviewsResponse = ApiResponse<Review>

export interface ReviewParam {
  id?: number[]
  q: string
  date_lte: string
  date_gte: string
  customer_id: number
  product_id: number
  status: REVIEW_STATUS
}

export type ReviewUrlQuery = UrlQuery<ReviewParam>

export interface CreateReviewRequest {
  data: Partial<Omit<Review, 'id'>>
}

export enum REVIEW_STATUS {
  'ACCEPTED' = 'accepted',
  'REJECTED' = 'rejected',
  'PENDING' = 'pending'
}

export type TableColumnsReview = TableColumns<Review>[]

export interface ReviewParams {
  q: string
  id?: string
  status: REVIEW_STATUS
  product_id: number
  customer_id: number
  posted_since: Date | string
  posted_before: Date | string
}
