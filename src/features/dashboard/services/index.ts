import { baseDataProvider } from '@/services/dataProvider'

export const getOrderList = async (page = 1, perPage = 10) => {
  const response = await baseDataProvider.getList('orders', {
    pagination: { page, perPage },
    sort: { field: 'id', order: 'ASC' },
    filter: {}
  })

  return response.data
}
