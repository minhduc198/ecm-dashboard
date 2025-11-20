import FilterBar from '@/features/orders/components/FilterBar'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'

import { getListParamsFormLS, getSettingColumnsFromLS } from '@/utils/orders'
import { useEffect, useMemo, useState } from 'react'

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
import { GetOrdersListRequest, Order, OrderFilterItem, OrderSettingColumn, OrderStatus } from './types'
import { useTranslation } from 'react-i18next'
import { initFilterItems, initialColumns, returnedColumn } from './constants'
import { cleanObject } from '@/utils'
import { useUndoOrderStore } from '@/store/undoOrderStore'

const OrderPage = () => {
  const { t } = useTranslation('order')
  const { filter, displayedFilters, sort, page, order, perPage } = getListParamsFormLS()
  const columnsLS = getSettingColumnsFromLS()

  const [filterItems, setFilterItems] = useState<OrderFilterItem[]>(
    initFilterItems.map((item) => ({
      ...item,
      isChecked: !!displayedFilters?.[item.key],
      label: item.key
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
    queryKey: ['order_list', ORDERED, orderListRq, sortParam.sortOrdered],
    queryFn: () =>
      fetchOrdersList({
        ...orderListRq,
        sort: sortParam.sortOrdered,
        filter: { ...orderListRq.filter, status: ORDERED }
      }),
    keepPreviousData: true
  })

  const { data: deliveredData, isFetching: isDeliveredFetching } = useQuery({
    queryKey: ['order_list', DELIVERED, orderListRq, sortParam.sortDelivered],
    queryFn: () =>
      fetchOrdersList({
        ...orderListRq,
        sort: sortParam.sortDelivered,

        filter: { ...orderListRq.filter, status: DELIVERED }
      }),
    keepPreviousData: true
  })

  const { data: cancelledData, isFetching: isCancelledFetching } = useQuery({
    queryKey: ['order_list', CANCELLED, orderListRq, sortParam.sortCancelled],
    queryFn: () =>
      fetchOrdersList({
        ...orderListRq,
        sort: sortParam.sortCancelled,

        filter: { ...orderListRq.filter, status: CANCELLED }
      }),
    keepPreviousData: true
  })

  const i18nInitialColumns = initialColumns.map((item) => {
    return {
      ...item,
      label: t(item.id)
    }
  })

  const orderSettingNameCols = useMemo(
    () => columnSetting[activeTab].filter((col) => col.isVisible).map((i) => i.id),
    [columnSetting, activeTab]
  )

  useEffect(() => {
    setFilterItems(
      initFilterItems.map((item) => ({
        ...item,
        isChecked: !!displayedFilters?.[item.key],
        label: t(item.key)
      }))
    )
  }, [t])

  useEffect(() => {
    const i18nReturnedColumn = {
      ...returnedColumn,
      label: t(returnedColumn.id)
    }

    const i18nColumnsLS = (columns: TableColumns<Order>[]) => {
      return columns.map((item) => {
        return {
          ...item,
          label: t(item.id)
        }
      })
    }

    const newColumnSetting = {
      ordered: columnsLS.ordered.length ? i18nColumnsLS(columnsLS.ordered) : i18nInitialColumns,
      delivered: columnsLS.delivered.length
        ? i18nColumnsLS(columnsLS.delivered)
        : i18nInitialColumns.concat(i18nReturnedColumn),
      cancelled: columnsLS.cancelled.length ? i18nColumnsLS(columnsLS.cancelled) : i18nInitialColumns
    }
    setColumnSetting(newColumnSetting)
  }, [t])

  const handleExport = () => {
    const tempData =
      activeTab === ORDER_STATUS.ORDERED
        ? orderedData?.data
        : activeTab === ORDER_STATUS.CANCELLED
          ? cancelledData?.data
          : deliveredData?.data

    const exportData = (tempData ?? []).map((data) => {
      const obj = {
        [t('order:customer')]: orderSettingNameCols.includes('customer')
          ? `${data.customer.first_name} ${data.customer.last_name}`
          : '',
        [t('order:date')]: orderSettingNameCols.includes('date') ? formatDate(data.date, 'HH:mm:ss d/M/yyyy') : '',
        [t('order:reference')]: orderSettingNameCols.includes('reference') ? data.reference : '',
        [t('order:address')]: orderSettingNameCols.includes('address') ? data.customer.address : '',
        [t('order:nb_items')]: orderSettingNameCols.includes('nb_items') ? data.basket.length : '',
        [t('order:returned')]: orderSettingNameCols.includes('returned') ? (data.returned ? 'Yes' : 'No') : '',
        [t('order:total_ex_taxes')]: orderSettingNameCols.includes('total_ex_taxes')
          ? formatCurrency(data.total_ex_taxes ?? 0)
          : '',
        [t('order:delivery_fees')]: orderSettingNameCols.includes('delivery_fees')
          ? formatCurrency(data.delivery_fees ?? 0)
          : '',
        [t('order:taxes')]: orderSettingNameCols.includes('taxes') ? formatCurrency(data.taxes ?? 0) : '',
        [t('order:total')]: orderSettingNameCols.includes('total') ? formatCurrency(data.total ?? 0) : ''
      }
      return cleanObject(obj)
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
                    {t('ordered')} (
                    {isOrderedFetching ? <CircularProgress size={14} color='primary' /> : orderedData?.total})
                  </Box>
                }
                value={ORDER_STATUS.ORDERED}
              />
              <Tab
                label={
                  <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                    {t('delivered')} (
                    {isDeliveredFetching ? <CircularProgress size={14} color='primary' /> : deliveredData?.total})
                  </Box>
                }
                value={ORDER_STATUS.DELIVERED}
              />
              <Tab
                label={
                  <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                    {t('cancelled')} (
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
