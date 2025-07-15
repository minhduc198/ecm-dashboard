import FilterBar from '@/features/orders/components/FilterBar'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'

import { useSearchParam } from '@/hooks/useSearchParam'
import { ColumnItem } from '@/types'
import { getListParamsFormLS } from '@/utils/orders'
import { useState } from 'react'
import Cancelled from './components/Cancelled'
import Delivered from './components/Delivered'
import Ordered from './components/Ordered'
import { FilterContext } from './context/FilterContext'
import { OrderFilterItem } from './type'

const initialColumns: ColumnItem[] = [
  {
    id: '0',
    label: 'Customers',
    value: 'customers',
    isVisible: true,
    numeric: false,
    disablePadding: true
  },
  {
    id: '1',
    label: 'Date',
    value: 'date',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    id: '2',
    label: 'Reference',
    value: 'reference',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },

  {
    id: '3',
    label: 'Address',
    value: 'address',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    id: '4',
    label: 'Nb items',
    value: 'nb _items',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    id: '5',
    label: 'Total ex taxes',
    value: 'total_ex_taxes',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    id: '6  ',
    label: 'Delivery fees',
    value: 'delivery_fees',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    id: '7',
    label: 'Taxes',
    value: 'taxes',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    id: '8',
    label: 'Total',
    value: 'total',
    isVisible: true,
    numeric: true,
    disablePadding: false
  }
]

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

const Orders = () => {
  const { setMany } = useSearchParam()
  const { filter, displayedFilters } = getListParamsFormLS()

  const [filterItems, setFilterItems] = useState<OrderFilterItem[]>(
    initFilterItems.map((item) => ({
      ...item,
      isChecked: !!displayedFilters[item.key]
    }))
  )

  const [columnSetting, setColumnSetting] = useState<{ [key: string]: ColumnItem[] }>({
    ordered: initialColumns,
    delivered: initialColumns,
    cancelled: initialColumns
  })

  const [activeTab, setActiveTab] = useState<string>(filter.status ?? 'ordered')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

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
