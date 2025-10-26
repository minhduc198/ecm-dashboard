import { DEFAULT_PAGE } from '@/constants'
import { DEFAULT_PER_PAGE_PRODUCT } from '@/features/products/constant'
import { Review } from '@/services/data-generator'
import { baseDataProvider } from '@/services/dataProvider'
import { SORT } from '@/types'
import {
  CreateReviewRequest,
  DeleteReviewsRequest,
  DeleteReviewsResponse,
  GetReviewListRequest,
  GetReviewsListResponse
} from '../types'

export class ReviewService {
  static async getReviewList(params: GetReviewListRequest): Promise<GetReviewsListResponse> {
    const pagination = params.pagination
    try {
      const response = await baseDataProvider.getList('reviews', {
        pagination,
        sort: params.sort ?? { field: 'reference', order: SORT.DESC },
        filter: params.filter ?? {}
      })

      return {
        ...(pagination ?? { page: DEFAULT_PAGE, perPage: DEFAULT_PER_PAGE_PRODUCT }),
        data: response.data as Review[],
        total: response.total || 0
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách reviews: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async deleteReviews(body: DeleteReviewsRequest): Promise<{ data: number[] }> {
    try {
      const response = await baseDataProvider.deleteMany('reviews', body)

      return {
        data: response.data || []
      }
    } catch (error) {
      throw new Error(`Lỗi khi xóa nhiều reviews: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async createReview(params: CreateReviewRequest): Promise<Review> {
    try {
      const response = await baseDataProvider.create('reviews', {
        data: params.data
      })

      return response.data as Review
    } catch (error) {
      throw new Error(`Lỗi khi tạo review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const fetchReviewList = (params: GetReviewListRequest) => ReviewService.getReviewList(params)
export const deleteReviews = (params: DeleteReviewsRequest) => ReviewService.deleteReviews(params)
export const createReview = (params: CreateReviewRequest) => ReviewService.createReview(params)
