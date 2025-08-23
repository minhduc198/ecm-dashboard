import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Grid } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import CustomLink from '@/components/CustomLink'
import { path } from '@/routers/path'
import { useNavigate } from 'react-router'
import FilterBarCustomer from './components/FilterBarCustomer'
import { initialCustomerColumns } from './constant'
import SettingColumns from '@/components/SettingColumns'
import { DropResult } from 'react-beautiful-dnd'
import { reorderDnd } from '@/utils'
import { TableColumns } from '@/types/table'
import { Customer } from '@/services/data-generator'
import { OrderSettingColumn } from '../orders/types'
import { useEffect, useState } from 'react'
import { getCustomerSettingColumnsFromLS, setCustomerSettingColumnsToLS } from '@/utils/customers'
import { TableColumnsCustomer } from './types'
import CustomTable from '@/components/CustomTable'
import { useQuery } from '@tanstack/react-query'
import { fetchCustomersList } from './service'

export default function Customers() {
  const navigate = useNavigate()
  const customerSettingColFromLS = getCustomerSettingColumnsFromLS()
  const [customerSettingCol, setCustomerSettingCol] = useState<TableColumnsCustomer>(
    customerSettingColFromLS.length ? customerSettingColFromLS : initialCustomerColumns
  )

  const { data: customerListData } = useQuery({
    queryKey: ['customer_list'],
    queryFn: () => fetchCustomersList({})
  })

  const handleCreateCustomer = () => {
    navigate(path.createCustomer)
  }

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    const newItems = reorderDnd<TableColumns<Customer>>(customerSettingCol, source.index, destination.index)
    const newColSetting = newItems
    setCustomerSettingCol(newColSetting)
    setCustomerSettingColumnsToLS(newColSetting as TableColumnsCustomer)
  }

  const handleChangeColumn = (columns: TableColumnsCustomer) => {
    const value = [...columns]
    setCustomerSettingCol(value)

    setCustomerSettingColumnsToLS(value as TableColumnsCustomer)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
        <Button onClick={handleCreateCustomer} startIcon={<AddIcon />} variant='text'>
          CREATE
        </Button>
        <SettingColumns columns={customerSettingCol} onDragEnd={onDragEnd} handleChangeColumn={handleChangeColumn} />
        <Button startIcon={<FileDownloadIcon />} variant='text'>
          EXPORT
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <FilterBarCustomer />
        </Grid>
        <Grid size={{ xs: 9 }}>
          {/* <CustomTable<Customer, number> rowId={'id'} dataSource={customerListData?.data ?? []} /> */}
        </Grid>
      </Grid>
    </Box>
  )
}
