import { fetchCustomersList } from '@/features/customers/service'
import { fetchOrdersList } from '@/features/orders/services'
import { SelectOptionItem } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface UseInfiniteOrdersProps {
  searchTerm?: string
  enabled?: boolean
}

export const useInfiniteOrders = ({ searchTerm, enabled = true }: UseInfiniteOrdersProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['orders_infinite', searchTerm],
    queryFn: ({ pageParam = 1 }) =>
      fetchOrdersList({
        pagination: { page: pageParam, perPage: 50 },
        filter: searchTerm ? { q: searchTerm } : undefined
      }),
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
    refetchOnWindowFocus: false
  })

  const orderOptions: SelectOptionItem[] = useMemo(() => {
    if (!data?.pages) return []

    return data.pages.flatMap((page) =>
      page.data.map((orders) => ({
        label: orders.reference,
        value: orders.id
      }))
    )
  }, [data?.pages])

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return {
    orderOptions,
    hasNextPage: !!hasNextPage,
    loadMore,
    isLoading: isLoading || isFetchingNextPage,
    isError,
    error,
    totalCount: data?.pages?.[0]?.total || 0
  }
}
