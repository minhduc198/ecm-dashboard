import { fetchCustomersList } from '@/features/customers/service'
import { fetchProductsList } from '@/features/products/services'
import { fetchReviewList } from '@/features/reviews/services'
import { SelectOptionItem } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface UseInfiniteReviewsProps {
  id?: number
  searchTerm?: string
  enabled?: boolean
}

export const useInfiniteProducts = ({ id, searchTerm, enabled = true }: UseInfiniteReviewsProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['reviews_infinite', searchTerm, id],
    queryFn: ({ pageParam = 1 }) => {
      const filterParams = searchTerm ? { q: searchTerm } : {}

      return fetchProductsList({
        pagination: { page: pageParam, perPage: 50 },
        filter: id ? { ...filterParams, id: [id] } : filterParams
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total
      const currentItems = allPages.reduce((acc, page) => acc + page.data.length, 0)

      if (currentItems < totalItems) {
        return allPages.length + 1
      }
      return undefined
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  const productOptions: SelectOptionItem[] = useMemo(() => {
    if (!data?.pages) return []

    return data.pages.flatMap((page) =>
      page.data.map((product) => ({
        label: product.reference,
        value: product.id
      }))
    )
  }, [data?.pages])

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return {
    productOptions,
    hasNextPage: !!hasNextPage,
    loadMore,
    isLoading: isLoading || isFetchingNextPage,
    isError,
    error,
    totalCount: data?.pages?.[0]?.total || 0
  }
}
