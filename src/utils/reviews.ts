import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'
import { DEFAULT_PER_PAGE_PRODUCT } from '@/features/products/constant'
import { ReviewUrlQuery, TableColumnsReview } from '@/features/reviews/types'
import { QuerySaveType, SORT } from '@/types'

const reviewListParamsLSName = 'review.listParams'
const reviewSettingColumnsLSName = 'review.settingColumns'
const reviewSaveQueries = 'review.saveQueries'

export function saveReviewListParamsToLS(value: ReviewUrlQuery) {
  localStorage.setItem(reviewListParamsLSName, JSON.stringify(value))
}

export function getReviewListParamsFormLS(): ReviewUrlQuery {
  const dataLs = localStorage.getItem(reviewListParamsLSName)

  if (!dataLs)
    return {
      filter: {},
      order: SORT.DESC,
      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE,
      sort: 'id'
    }
  const obj = JSON.parse(dataLs)
  return obj
}

export function setReviewSettingColumnsToLS(value: TableColumnsReview) {
  localStorage.setItem(reviewSettingColumnsLSName, JSON.stringify(value))
}

export function getReviewSettingColumnsFromLS(): TableColumnsReview {
  const dataLs = localStorage.getItem(reviewSettingColumnsLSName)

  if (!dataLs) {
    return []
  }

  return JSON.parse(dataLs)
}

export function saveQueriesReview(data: QuerySaveType[]) {
  if (!data.length) {
    localStorage.removeItem(reviewSaveQueries)
  } else {
    localStorage.setItem(reviewSaveQueries, JSON.stringify(data))
  }
}

export function getReviewSaveQueries(): QuerySaveType[] {
  const dataLs = localStorage.getItem(reviewSaveQueries)
  if (!dataLs) {
    return []
  } else {
    return JSON.parse(dataLs)
  }
}
