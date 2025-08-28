import { queryClient } from '@/App'
import CustomTable from '@/components/CustomTable'
import SettingColumns from '@/components/SettingColumns'
import { useSearchParam } from '@/hooks/useSearchParam'
import { path } from '@/routers/path'
import { Customer } from '@/services/data-generator'
import { useUndoCustomerStore } from '@/store/undoCustomerStore'
import { TableColumns } from '@/types/table'
import { reorderDnd } from '@/utils'
import { formatCurrency } from '@/utils/currency'
import {
  getCustomerListParamsFormLS,
  getCustomerSettingColumnsFromLS,
  saveCustomerListParamsToLS,
  setCustomerSettingColumnsToLS
} from '@/utils/customers'
import { formatDate } from '@/utils/date'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Box, Button, Grid, Snackbar, Tooltip } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router'
import FilterBarCustomer from './components/FilterBarCustomer'
import { DEFAULT_PAGE_CUSTOMER, initialCustomerColumns } from './constant'
import { deleteCustomers, fetchCustomersList } from './service'
import { GetCustomersListRequest, TableColumnsCustomer } from './types'

export default function Customers() {
  const navigate = useNavigate()
  const { setMany } = useSearchParam()
  const customerSettingColFromLS = getCustomerSettingColumnsFromLS()
  const [customerSettingCol, setCustomerSettingCol] = useState<TableColumnsCustomer>(
    customerSettingColFromLS.length ? customerSettingColFromLS : initialCustomerColumns
  )
  const { temporaryData, isOpenUndo, timerId, setTemporaryData, setIsOpenUndo, setTimerId } = useUndoCustomerStore()
  const currentListCustomerParamsLS = getCustomerListParamsFormLS()
  const { filter, order, page, perPage, sort } = getCustomerListParamsFormLS()

  const [customerListRq, setCustomerListRq] = useState<GetCustomersListRequest>({
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

  const { data: customerListData } = useQuery({
    queryKey: ['customer_list', customerListRq],
    queryFn: () => fetchCustomersList(customerListRq)
  })

  const { mutate: deleteCustomersMutation } = useMutation({
    mutationKey: ['delete_customers'],
    mutationFn: (ids: number[]) => deleteCustomers({ ids }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customer_list'] })
  })

  useEffect(() => {
    if (!timerId) {
      setTemporaryData(customerListData?.data ?? [])
    }
  }, [customerListData?.data])

  const columns: TableColumnsCustomer = useMemo(() => {
    const cloneColumnSetting = cloneDeep(customerSettingCol)

    return cloneColumnSetting
      .filter((col) => col.isVisible)
      .map((col) => {
        const tableColumns: TableColumns<Customer> = {
          id: col.id,
          label: col.label,
          numeric: col.numeric,
          sortable: true,
          sortBy: col.id
        }

        switch (col.id) {
          case 'first_name':
            return {
              ...tableColumns,
              cell: (_, row) => <Box sx={{ fontSize: '14px' }}>{`${row.first_name} ${row.last_name}`}</Box>
            }

          case 'last_seen':
            return {
              ...tableColumns,
              cell: (value) => formatDate(String(value), 'd/M/yyyy')
            }

          case 'total_spent':
            return {
              ...tableColumns,
              cell: (value) => formatCurrency(Number(value))
            }

          case 'latest_purchase':
            return {
              ...tableColumns,
              cell: (value) => formatDate(String(value ?? ''), 'HH:mm:ss d/M/yyyy')
            }

          case 'has_newsletter':
            return {
              ...tableColumns,
              cell: (value) =>
                value ? (
                  <Tooltip title='Yes' placement='bottom'>
                    <CheckIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title='No' placement='bottom'>
                    <ClearIcon />
                  </Tooltip>
                )
            }

          case 'groups':
            return {
              ...tableColumns,
              cell: (_, row) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {row.groups.map((seg) => {
                    return (
                      <Box
                        sx={{
                          bgcolor: 'rgba(0,0,0, 0.1)',
                          padding: '4px',
                          paddingInline: '8px',
                          borderRadius: '15px',
                          fontSize: '13px'
                        }}
                      >
                        {`${seg.charAt(0).toUpperCase()}${seg.slice(1)}`}
                      </Box>
                    )
                  })}
                </Box>
              )
            }

          case 'birthday':
            return {
              ...tableColumns,
              cell: (value) => formatDate(String(value ?? ''), 'd/M/yyyy')
            }
          default:
            return tableColumns
        }
      })
  }, [customerSettingCol])

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

  const handleDeleteCustomers = (ids: number[]) => {
    const softDeleteOrder = temporaryData.filter((data) => !ids.includes(data.id))
    setTemporaryData(softDeleteOrder)
    setIsOpenUndo(true)

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      deleteCustomersMutation(ids)
      setTimerId(null)
    }, 3000)

    setTimerId(timeOut)
  }

  const handleUndo = () => {
    setIsOpenUndo(false)
    setTemporaryData(customerListData?.data ?? [])
    clearTimeout(timerId ?? 0)
  }

  const handleSetRowsPerPage = (rowPerPage: number) => {
    saveCustomerListParamsToLS({
      ...currentListCustomerParamsLS,
      page: customerListRq.pagination.page - 1,
      perPage: rowPerPage
    })
    setCustomerListRq({
      ...customerListRq,
      pagination: {
        perPage: rowPerPage,
        page: DEFAULT_PAGE_CUSTOMER
      }
    })

    setMany({
      perPage: JSON.stringify(rowPerPage)
    })
  }

  const handleSetPage = (page: number) => {
    saveCustomerListParamsToLS({
      ...currentListCustomerParamsLS,
      page,
      perPage: customerListRq.pagination.perPage
    })

    setCustomerListRq({
      ...customerListRq,
      pagination: {
        perPage: customerListRq.pagination.perPage,
        page: page + 1
      }
    })

    setMany({
      page: JSON.stringify(page)
    })
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
          <FilterBarCustomer setCustomerListRq={setCustomerListRq} />
        </Grid>
        <Grid size={{ xs: 9 }}>
          <CustomTable<Customer, number>
            rowId={'id'}
            columns={columns}
            dataSource={temporaryData}
            handleDelete={handleDeleteCustomers}
            handleSetPage={handleSetPage}
            handleSetRowsPerPage={handleSetRowsPerPage}
            pagination={{
              page,
              perPage
            }}
            totalItems={customerListData?.total}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={isOpenUndo}
        autoHideDuration={1000}
        message='Customer deleted'
        action={
          <Button size='small' onClick={handleUndo}>
            UNDO
          </Button>
        }
      />
    </Box>
  )
}
