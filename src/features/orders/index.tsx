import FilterBar from '@/features/orders/components/FilterBar'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'

import { getListParamsFormLS, getSettingColumnsFromLS } from '@/utils/orders'
import { useEffect, useState } from 'react'

import { DEFAULT_PAGE, DEFAULT_PER_PAGE, ORDER_STATUS } from '@/constants'
import { SORT } from '@/types'
import { TableColumns } from '@/types/table'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { utils, writeFileXLSX } from 'xlsx'
import OrderList from './components/OrderList'
import { FilterContext } from './context/FilterContext'
import { fetchOrdersList } from './services'
import { GetOrdersListRequest, Order, OrderFilterItem, OrderStatus } from './types'

const initFilterItems: OrderFilterItem[] = [
  {
    label: 'Customer',
    key: 'customer_id',
    isChecked: false
  },
  {
    label: 'Passed Since',
    key: 'date_gte',
    isChecked: false
  },
  {
    label: 'Passed Before',
    key: 'date_lte',
    isChecked: false
  },
  {
    label: 'Min amount',
    key: 'total_gte',
    isChecked: false
  },
  {
    label: 'Returned',
    key: 'returned',
    isChecked: false
  }
]

const initialColumns: TableColumns<Order>[] = [
  {
    label: 'Customers',
    id: 'customer',
    isVisible: true,
    numeric: false,
    disablePadding: true
  },
  {
    label: 'Date',
    id: 'date',
    isVisible: false,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Reference',
    id: 'reference',
    isVisible: true,
    numeric: false,
    disablePadding: false
  },

  {
    label: 'Address',
    id: 'address',
    isVisible: false,
    numeric: false,
    disablePadding: false
  },
  {
    label: 'Nb items',
    id: 'nb_items',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Total ex taxes',
    id: 'total_ex_taxes',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Delivery fees',
    id: 'delivery_fees',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Taxes',
    id: 'taxes',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Total',
    id: 'total',
    isVisible: true,
    numeric: true,
    disablePadding: false
  }
]

const returnedColumn: TableColumns<Order> = {
  label: 'Returned',
  id: 'returned',
  isVisible: true,
  numeric: true,
  disablePadding: false
}

const OrderPage = () => {
  const { filter, displayedFilters, sort, page, order, perPage } = getListParamsFormLS()
  const columnsLS = getSettingColumnsFromLS()

  const [filterItems, setFilterItems] = useState<OrderFilterItem[]>(
    initFilterItems.map((item) => ({
      ...item,
      isChecked: !!displayedFilters?.[item.key]
    }))
  )

  const [columnSetting, setColumnSetting] = useState<{ [key: string]: TableColumns<Order>[] }>({
    ordered: [],
    delivered: [],
    cancelled: []
  })
  const [activeTab, setActiveTab] = useState<OrderStatus>(filter.status ?? ORDER_STATUS.ORDERED)
  const [orderListRq, setOrderListRq] = useState<GetOrdersListRequest>({
    filter,
    sort: {
      field: sort,
      order
    },
    pagination: {
      page: page + 1,
      perPage
    }
  })

  const [sortParam, setSortParam] = useState({
    sortOrdered: { field: '', order: SORT.ASC },
    sortDelivered: { field: '', order: SORT.ASC },
    sortCancelled: { field: '', order: SORT.ASC }
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: OrderStatus) => {
    setActiveTab(newValue)
  }

  const { ORDERED, DELIVERED, CANCELLED } = ORDER_STATUS

  const { data: orderedData, isFetching: isOrderedFetching } = useQuery({
    queryKey: [ORDERED, orderListRq, sortParam.sortOrdered],
    queryFn: () =>
      fetchOrdersList({
        ...orderListRq,
        sort: sortParam.sortOrdered,
        filter: { ...orderListRq.filter, status: ORDERED }
      }),
    keepPreviousData: true,
    staleTime: 60 * 60 * 1000
  })

  const { data: deliveredData, isFetching: isDeliveredFetching } = useQuery({
    queryKey: [DELIVERED, orderListRq, sortParam.sortDelivered],
    queryFn: () =>
      fetchOrdersList({
        ...orderListRq,
        sort: sortParam.sortDelivered,

        filter: { ...orderListRq.filter, status: DELIVERED }
      }),
    keepPreviousData: true,
    staleTime: 60 * 60 * 1000
  })

  const { data: cancelledData, isFetching: isCancelledFetching } = useQuery({
    queryKey: [CANCELLED, orderListRq, sortParam.sortCancelled],
    queryFn: () =>
      fetchOrdersList({
        ...orderListRq,
        sort: sortParam.sortCancelled,

        filter: { ...orderListRq.filter, status: CANCELLED }
      }),
    keepPreviousData: true,
    staleTime: 60 * 60 * 1000
  })

  useEffect(() => {
    const newColumnSetting = {
      ordered: columnsLS.ordered.length ? columnsLS.ordered : initialColumns,
      delivered: columnsLS.delivered.length ? columnsLS.delivered : initialColumns.concat(returnedColumn),
      cancelled: columnsLS.cancelled.length ? columnsLS.cancelled : initialColumns
    }
    setColumnSetting(newColumnSetting)
  }, [])

  const handleExport = () => {
    const ids = columnSetting[activeTab].filter((i) => i.isVisible).map((i) => i.id)
    const tempData =
      activeTab === ORDER_STATUS.ORDERED
        ? orderedData?.data
        : activeTab === ORDER_STATUS.CANCELLED
          ? cancelledData?.data
          : deliveredData?.data

    const exportData = cloneDeep(tempData || []).map((item) => {
      const obj = {
        date: formatDate(String(item.date), 'HH:mm:ss d/M/yyyy'),
        taxes: formatCurrency(Number(item.taxes)),
        total: formatCurrency(Number(item.total)),
        delivery_fees: formatCurrency(Number(item.delivery_fees)),
        total_ex_taxes: formatCurrency(Number(item.total_ex_taxes)),
        customer: item.customer.first_name + ' ' + item.customer.last_name,
        returned: item.returned ? 'Yes' : 'No',
        nb_items: item.basket.length,
        address: item.customer.address,
        reference: item.reference
      }

      Object.keys(cloneDeep(obj)).forEach((key: string) => {
        if (!ids.includes(key as keyof Order)) {
          delete obj[key as keyof typeof obj]
        }
      })

      return obj
    })

    const ws = utils.json_to_sheet(exportData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data')
    writeFileXLSX(wb, `${activeTab}_${formatDate(new Date().toISOString(), 'dMyyyy')}.xlsx`)
  }

  return (
    <FilterContext.Provider
      value={{
        orderListRq,
        activeTab,
        columnSetting,
        filterItems,
        setActiveTab,
        setOrderListRq,
        setColumnSetting,
        setFilterItems
      }}
    >
      <Box>
        <FilterBar handleExport={handleExport} />
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList variant='fullWidth' onChange={handleTabChange}>
              <Tab
                label={
                  <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                    Ordered ({isOrderedFetching ? <CircularProgress size={14} color='primary' /> : orderedData?.total})
                  </Box>
                }
                value={ORDER_STATUS.ORDERED}
              />
              <Tab
                label={
                  <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                    Delivered (
                    {isDeliveredFetching ? <CircularProgress size={14} color='primary' /> : deliveredData?.total})
                  </Box>
                }
                value={ORDER_STATUS.DELIVERED}
              />
              <Tab
                label={
                  <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                    Cancelled (
                    {isCancelledFetching ? <CircularProgress size={14} color='primary' /> : cancelledData?.total})
                  </Box>
                }
                value={ORDER_STATUS.CANCELLED}
              />
            </TabList>
          </Box>
          <TabPanel sx={{ padding: '0px' }} value={ORDER_STATUS.ORDERED}>
            <OrderList
              setSortParam={setSortParam}
              data={orderedData?.data || []}
              totalItems={orderedData?.total || 0}
              pagination={{
                page: orderedData?.page ? orderedData.page - 1 : DEFAULT_PAGE,
                perPage: orderedData?.perPage || DEFAULT_PER_PAGE
              }}
            />
          </TabPanel>
          <TabPanel sx={{ padding: '0px' }} value={ORDER_STATUS.DELIVERED}>
            <OrderList
              setSortParam={setSortParam}
              data={deliveredData?.data || []}
              totalItems={deliveredData?.total || 0}
              pagination={{
                page: deliveredData?.page ? deliveredData.page - 1 : DEFAULT_PAGE,
                perPage: deliveredData?.perPage || DEFAULT_PER_PAGE
              }}
            />
          </TabPanel>
          <TabPanel sx={{ padding: '0px' }} value={ORDER_STATUS.CANCELLED}>
            <OrderList
              setSortParam={setSortParam}
              data={cancelledData?.data || []}
              totalItems={cancelledData?.total || 0}
              pagination={{
                page: cancelledData?.page ? cancelledData.page - 1 : DEFAULT_PAGE,
                perPage: cancelledData?.perPage || DEFAULT_PER_PAGE
              }}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </FilterContext.Provider>
  )
}

export default OrderPage
