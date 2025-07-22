import FilterBar from '@/features/orders/components/FilterBar'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'

import { ColumnItem } from '@/types'
import { getListParamsFormLS, getSettingColumnsFromLS } from '@/utils/orders'
import { useEffect, useState } from 'react'
import Cancelled from './components/Cancelled'
import Delivered from './components/Delivered'
import Ordered from './components/Ordered'
import { FilterContext } from './context/FilterContext'
import { OrderFilterItem } from './type'

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
  const { filter, displayedFilters } = getListParamsFormLS()
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

  const [activeTab, setActiveTab] = useState<string>(filter.status ?? 'ordered')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
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
        activeTab,
        setActiveTab,
        filterItems,
        columnSetting,
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
            <Ordered />
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
