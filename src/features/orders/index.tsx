import FilterBar from '@/features/orders/components/FilterBar'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'

import { ColumnItem, IPagination } from '@/types'
import { getListParamsFormLS, getSettingColumnsFromLS } from '@/utils/orders'
import { useEffect, useState } from 'react'
import Cancelled from './components/Cancelled'
import Delivered from './components/Delivered'
import Ordered from './components/Ordered'
import { FilterContext } from './context/FilterContext'
import { OrderFilterItem } from './type'
import { useQuery } from '@tanstack/react-query'
import { fetchOrdersList } from './services'
import { GetOrdersListRequest, OrderStatus } from './types'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'

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

const initialColumns: ColumnItem[] = [
  {
    label: 'Customers',
    id: 'customer_id',
    isVisible: true,
    numeric: false,
    disablePadding: true
  },
  {
    label: 'Date',
    id: 'date',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Reference',
    id: 'reference',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },

  {
    label: 'Address',
    id: 'address',
    isVisible: false,
    numeric: true,
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

const Orders = () => {
  const { filter, displayedFilters, sort, page, order, perPage } = getListParamsFormLS()
  const columnsLS = getSettingColumnsFromLS()

  const [filterItems, setFilterItems] = useState<OrderFilterItem[]>(
    initFilterItems.map((item) => ({
      ...item,
      isChecked: !!displayedFilters[item.key]
    }))
  )

  const [columnSetting, setColumnSetting] = useState<{ [key: string]: ColumnItem[] }>({
    ordered: [],
    delivered: [],
    cancelled: []
  })
  const [activeTab, setActiveTab] = useState<OrderStatus>(filter.status ?? 'ordered')
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: OrderStatus) => {
    setActiveTab(newValue)
  }

  const { data: orderData } = useQuery({
    queryKey: ['orders', orderListRq],
    queryFn: () => fetchOrdersList(orderListRq),
    keepPreviousData: true
  })

  const orderList = orderData?.data || []
  const pagination: IPagination = {
    page: orderData?.page ? orderData.page - 1 : DEFAULT_PAGE,
    perPage: orderData?.perPage || DEFAULT_PER_PAGE
  }

  useEffect(() => {
    const newColumnSetting = {
      ordered: columnsLS.ordered.length ? columnsLS.ordered : initialColumns,
      delivered: columnsLS.delivered.length ? columnsLS.delivered : initialColumns,
      cancelled: columnsLS.cancelled.length ? columnsLS.cancelled : initialColumns
    }
    setColumnSetting(newColumnSetting)
  }, [])

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
        <FilterBar />
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList variant='fullWidth' onChange={handleTabChange}>
              <Tab label='Ordered' value='ordered' />
              <Tab label='Delivered' value='delivered' />
              <Tab label='Cancelled' value='cancelled' />
            </TabList>
          </Box>
          <TabPanel sx={{ padding: '0px' }} value='ordered'>
            <Ordered data={orderList} totalItems={orderData?.total || 0} pagination={pagination} />
          </TabPanel>
          <TabPanel sx={{ padding: '0px' }} value='delivered'>
            <Delivered />
          </TabPanel>
          <TabPanel sx={{ padding: '0px' }} value='cancelled'>
            <Cancelled />
          </TabPanel>
        </TabContext>
      </Box>
    </FilterContext.Provider>
  )
}

export default Orders
