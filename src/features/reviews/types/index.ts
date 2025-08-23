import { Review } from '@/services/data-generator'
import { ApiResponseList } from '@/types'

export type getReviewListReq = {
  filter: Partial<Review>
  order: 'ASC' | 'DESC'
  page: number
  perPage: number
  sort: string
}

export type ReviewListResponse = ApiResponseList<Review>
