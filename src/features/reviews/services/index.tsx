import { baseDataProvider } from '@/services/dataProvider'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'
import { getReviewListReq, ReviewListResponse } from '../types'

export class ReviewService {
  static async getReviewsList(params: Partial<getReviewListReq>): Promise<ReviewListResponse> {
    const pagination = {
      page: params.page || DEFAULT_PAGE,
      perPage: params.perPage || DEFAULT_PER_PAGE
    }

    try {
      const response = await baseDataProvider.getList('reviews', {
        pagination,
        sort: {
          field: params.sort || 'id',
          order: params.order || 'ASC'
        },
        filter: params.filter ?? {}
      })

      return {
        ...pagination,
        data: response.data,
        total: response.total || 0
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const fetchReviewsList = (params: Partial<getReviewListReq>) => ReviewService.getReviewsList(params)
