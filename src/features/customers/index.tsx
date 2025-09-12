import { queryClient } from '@/App'
import CustomLink from '@/components/CustomLink'
import CustomTable from '@/components/CustomTable'
import SettingColumns from '@/components/SettingColumns'
import { useSearchParam } from '@/hooks/useSearchParam'
import { path } from '@/routers/path'
import { Customer } from '@/services/data-generator'
import { useUndoCustomerStore } from '@/store/undoCustomerStore'
import { SORT } from '@/types'
import { TableColumns } from '@/types/table'
import { cleanObject, reorderDnd } from '@/utils'
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
import { Avatar, Box, Button, Grid, Snackbar, Tooltip } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect, useMemo, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router'
import { utils, writeFileXLSX } from 'xlsx'
import FilterBarCustomer from './components/FilterBarCustomer'
import { DEFAULT_PAGE_CUSTOMER, initialCustomerColumns } from './constant'
import { deleteCustomers, fetchCustomersList } from './service'
import { CustomerParam, GetCustomersListRequest, TableColumnsCustomer } from './types'

export default function Customers() {
  const navigate = useNavigate()
  const { setMany } = useSearchParam()
  const customerSettingColFromLS = getCustomerSettingColumnsFromLS()
  const [customerSettingCol, setCustomerSettingCol] = useState<TableColumnsCustomer>(
    customerSettingColFromLS.length ? customerSettingColFromLS : initialCustomerColumns
  )
  const { action, tmpUndoData, isOpenUndo, timerId, setTmpUndoData, setIsOpenUndo, setTimerId, setAction } =
    useUndoCustomerStore()
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
    queryFn: () => fetchCustomersList(customerListRq),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })

  const { mutate: deleteCustomersMutation } = useMutation({
    mutationKey: ['delete_customers'],
    mutationFn: (ids: number[]) => deleteCustomers({ ids }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customer_list'] })
  })

  const sortFromLs = {
    field: currentListCustomerParamsLS.sort,
    order: currentListCustomerParamsLS.order
  }

  const customerSettingNameCols = useMemo(
    () => customerSettingCol.filter((col) => col.isVisible).map((i) => i.id),
    [customerSettingCol]
  )

  const handleSetQueryDetail = (row: Customer) => {
    queryClient.setQueryData(['customer_detail', row.id.toString()], { data: row })
  }

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
              minWidth: 200,
              cell: (_, row) => (
                <CustomLink to={`${path.customers}/${row.id}`} onClick={() => handleSetQueryDetail(row)}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar sx={{ width: 25, height: 25 }} src={row.avatar} alt={row.first_name} />
                    <Box>{`${row.first_name} ${row.last_name}`}</Box>
                  </Box>
                </CustomLink>
              )
            }

          case 'last_seen':
            return {
              ...tableColumns,
              cell: (value) => (typeof value === 'string' ? formatDate(value, 'd/M/yyyy') : null)
            }

          case 'total_spent':
            return {
              ...tableColumns,
              cell: (value, row) =>
                row.has_ordered ? (
                  <Box sx={{ color: 'red' }}>{formatCurrency(Number(value ?? 0))}</Box>
                ) : (
                  formatCurrency(Number(value ?? 0))
                )
            }

          case 'latest_purchase':
            return {
              ...tableColumns,
              cell: (value) => (typeof value === 'string' ? formatDate(value, 'HH:mm:ss d/M/yyyy') : null)
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
                  {row.groups?.map((seg, index) => {
                    return (
                      <Box
                        key={index}
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
              cell: (value) => (typeof value === 'string' ? formatDate(value, 'd/M/yyyy') : null)
            }
          default:
            return tableColumns
        }
      })
  }, [customerSettingCol])

  useEffect(() => {
    if (!timerId) {
      setTmpUndoData(customerListData?.data ?? [])
    }
  }, [customerListData?.data])

  const handleViewCustomerDetail = (row: Customer) => {
    handleSetQueryDetail(row)
    navigate(`${path.customers}/${row.id}`)
  }

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
    const softDeleteOrder = tmpUndoData.filter((data) => !ids.includes(data.id))
    setTmpUndoData(softDeleteOrder)
    setIsOpenUndo(true)
    if (setAction) {
      setAction('Delete Customer')
    }

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      deleteCustomersMutation(ids)
      setTimerId(null)
    }, 3000)

    setTimerId(timeOut)
  }

  const handleUndo = () => {
    setIsOpenUndo(false)
    setTimerId(null)
    setTmpUndoData(customerListData?.data ?? [])
    if (timerId) {
      clearTimeout(timerId)
    }
  }

  const handleSetRowsPerPage = (rowPerPage: number) => {
    saveCustomerListParamsToLS({
      ...currentListCustomerParamsLS,
      page: DEFAULT_PAGE_CUSTOMER - 1,
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

  const handleExport = () => {
    const exportData = tmpUndoData.map((data) => {
      const obj = {
        ['Name']: customerSettingNameCols.includes('first_name') ? `${data.first_name} ${data.last_name}` : '',
        ['Last seen']: customerSettingNameCols.includes('has_newsletter')
          ? formatDate(data.last_seen, 'HH:mm:ss d/M/yyyy')
          : '',
        ['Orders']: customerSettingNameCols.includes('nb_orders') ? data.nb_orders : '',
        ['Total spent']: customerSettingNameCols.includes('total_spent') ? formatCurrency(data.total_spent ?? 0) : '',
        ['Latest purchase']: customerSettingNameCols.includes('latest_purchase')
          ? formatDate(data.last_seen, 'HH:mm:ss d/M/yyyy')
          : '',
        ['News']: customerSettingNameCols.includes('has_newsletter') ? (data.has_newsletter ? 'Yes' : 'No') : '',
        ['Segments']: customerSettingNameCols.includes('groups') ? data?.groups?.join(',').replace(',', ' ') : '',
        ['Birthday']: customerSettingNameCols.includes('birthday') ? formatDate(data.last_seen, 'd/M/yyyy') : ''
      }

      return cleanObject(obj)
    })

    const ws = utils.json_to_sheet(exportData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data')
    writeFileXLSX(wb, `customer_list_${formatDate(new Date().toISOString(), 'd_M_yyyy')}.xlsx`)
  }

  const handleSort = (field: string, order: SORT) => {
    const sort = {
      field,
      order
    }

    setMany({ sort: JSON.stringify(sort) })

    setCustomerListRq({
      ...customerListRq,
      sort: {
        field,
        order
      }
    })

    saveCustomerListParamsToLS({
      ...currentListCustomerParamsLS,
      order,
      sort: field as keyof CustomerParam
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
        <Button onClick={handleCreateCustomer} startIcon={<AddIcon />} variant='text'>
          CREATE
        </Button>
        <SettingColumns columns={customerSettingCol} onDragEnd={onDragEnd} handleChangeColumn={handleChangeColumn} />
        <Button onClick={handleExport} startIcon={<FileDownloadIcon />} variant='text'>
          EXPORT
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <FilterBarCustomer customerListRq={customerListRq} setCustomerListRq={setCustomerListRq} />
        </Grid>
        <Grid size={{ xs: 9 }}>
          <CustomTable<Customer, number>
            rowId='id'
            columns={columns}
            dataSource={tmpUndoData}
            handleDelete={handleDeleteCustomers}
            handleSetPage={handleSetPage}
            handleSetRowsPerPage={handleSetRowsPerPage}
            handleSort={handleSort}
            sortColFromLS={sortFromLs}
            onRowClick={handleViewCustomerDetail}
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
        message={action}
        action={
          <Button size='small' onClick={handleUndo}>
            UNDO
          </Button>
        }
      />
    </Box>
  )
}
