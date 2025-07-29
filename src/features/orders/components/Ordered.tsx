import CustomTable from '@/components/CustomTable'
import { DEFAULT_PAGE } from '@/constants'
import { useSearchParam } from '@/hooks/useSearchParam'
import { IPagination } from '@/types'
import { TableColumns } from '@/types/table'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { getListParamsFormLS, saveListParamsToLS } from '@/utils/orders'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { cloneDeep } from 'lodash'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FilterContext } from '../context/FilterContext'
import { Order } from '../types'
import { Avatar, Box, Button, IconButton, Link, Snackbar, SnackbarCloseReason } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteOrders } from '../services'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
  data: Order[]
  totalItems: number
  pagination: IPagination
}

let timerId: NodeJS.Timeout
export default function Ordered({ data, totalItems, pagination }: Props) {
  const { columnSetting, activeTab, orderListRq, setOrderListRq } = useContext(FilterContext)
  const { setMany } = useSearchParam()
  const currentListParamsLS = getListParamsFormLS()
  const queryClient = useQueryClient()

  const [dataSource, setDataSource] = useState<Order[]>([])
  const [openSnackbar, setOpenSnackbar] = useState(false)

  useEffect(() => {
    setDataSource(data)
  }, [data])

  const { mutate: deleteItemMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteOrders(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  const columns: TableColumns<Order>[] = useMemo(() => {
    const cloneColumnSetting = cloneDeep(columnSetting[activeTab])
    return cloneColumnSetting
      .filter((col) => col.isVisible)
      .map((col) => {
        const tableColumn = {
          id: col.id,
          label: col.label,
          numeric: col.numeric
        }

        switch (col.id) {
          case 'returned':
            return {
              ...tableColumn,
              cell: (value) => (value ? <CheckIcon /> : <ClearIcon />)
            }
          case 'taxes':
          case 'total':
          case 'delivery_fees':
          case 'total_ex_taxes':
            return {
              ...tableColumn,
              cell: (value) => formatCurrency(Number(value))
            }
          case 'date':
            return {
              ...tableColumn,
              cell: (value) => formatDate(String(value), 'HH:mm:ss d/M/yyyy')
            }
          case 'customer':
            return {
              ...tableColumn,
              cell: (_, row) => (
                <Link sx={{ display: 'flex', alignItems: 'center', gap: 1 }} href='/dashboard'>
                  <Avatar sx={{ width: 25, height: 25 }} src={row.customer.avatar} alt={row.customer.first_name} />
                  <Box>{`${row.customer.first_name} ${row.customer.last_name}`}</Box>
                </Link>
              )
            }
          case 'address':
            return {
              ...tableColumn,
              cell: (_, row) => row.customer.address
            }

          case 'nb_items':
            return {
              ...tableColumn,
              cell: (_, row) => row.basket.length
            }
          default:
            return tableColumn
        }
      })
  }, [columnSetting[activeTab]])

  const handleSetRowsPerPage = (rowPerPage: number) => {
    saveListParamsToLS({
      ...currentListParamsLS,
      page: orderListRq.pagination.page - 1,
      perPage: rowPerPage
    })
    setOrderListRq({
      ...orderListRq,
      pagination: {
        perPage: rowPerPage,
        page: DEFAULT_PAGE + 1
      }
    })

    setMany({
      perPage: JSON.stringify(rowPerPage)
    })
  }

  const handleSetPage = (page: number) => {
    saveListParamsToLS({
      ...currentListParamsLS,
      page,
      perPage: orderListRq.pagination.perPage
    })
    setOrderListRq({
      ...orderListRq,
      pagination: {
        perPage: orderListRq.pagination.perPage,
        page: page + 1
      }
    })

    setMany({
      page: JSON.stringify(page)
    })
  }

  const handleDelete = (deletedIds: number[]) => {
    const softDeleteOrder = dataSource.filter((data) => !deletedIds.includes(data.id))
    setDataSource(softDeleteOrder)
    setOpenSnackbar(true)

    timerId = setTimeout(() => {
      setOpenSnackbar(false)
      deleteItemMutation(deletedIds)
    }, 3000)
  }

  const handleUndo = () => {
    setOpenSnackbar(false)
    setDataSource(data)
    clearTimeout(timerId)
  }

  return (
    <>
      <CustomTable<Order, number>
        rowId='id'
        columns={columns}
        dataSource={dataSource || []}
        totalItems={totalItems}
        page={pagination.page}
        rowsPerPage={pagination.perPage}
        handleSetPage={handleSetPage}
        handleSetRowsPerPage={handleSetRowsPerPage}
        handleDelete={handleDelete}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        message='Order deleted'
        action={
          <Button size='small' onClick={handleUndo}>
            UNDO
          </Button>
        }
      />
    </>
  )
}
