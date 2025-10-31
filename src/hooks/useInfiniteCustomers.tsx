import { fetchCustomersList } from '@/features/customers/service'
import { SelectOptionItem } from '@/types'
import { cleanObject } from '@/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface UseInfiniteCustomersProps {
  searchTerm?: string
  enabled?: boolean
  customerId?: string
}

export const useInfiniteCustomers = ({ searchTerm, customerId, enabled = true }: UseInfiniteCustomersProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['customers_infinite', searchTerm, customerId],
    queryFn: ({ pageParam = 1 }) =>
      fetchCustomersList({
        pagination: { page: pageParam, perPage: 50 },
        filter: searchTerm ? cleanObject({ q: searchTerm, id: customerId?.toString() }) : undefined
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
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  const customerOptions: SelectOptionItem[] = useMemo(() => {
    if (!data?.pages) return []

    return data.pages.flatMap((page) =>
      page.data.map((customer) => ({
        label: `${customer.first_name} ${customer.last_name}`,
        value: customer.id
      }))
    )
  }, [data?.pages])

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return {
    customerOptions,
    hasNextPage: !!hasNextPage,
    loadMore,
    isLoading: isLoading || isFetchingNextPage,
    isError,
    error,
    totalCount: data?.pages?.[0]?.total || 0
  }
}
