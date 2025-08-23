import { queryClient } from '@/App'
import CustomTable from '@/components/CustomTable'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE, ORDER_STATUS } from '@/constants'
import { useSearchParam } from '@/hooks/useSearchParam'
import { path } from '@/routers/path'
import { Customer } from '@/services/data-generator'
import { useHeaderTitleStore } from '@/store/headerStore'
import { useUndoOrderStore } from '@/store/undoOrderStore'
import { IPagination, SORT } from '@/types'
import { TableColumns } from '@/types/table'
import { cleanObject } from '@/utils'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { getListParamsFormLS, saveListParamsToLS } from '@/utils/orders'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { Avatar, Box, Button, Link, Snackbar, Tooltip } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { FilterContext } from '../context/FilterContext'
import { deleteOrders } from '../services'
import { Order, OrderParams } from '../types'

interface Props {
  data: Order[]
  totalItems: number
  pagination: IPagination
  setSortParam: React.Dispatch<
    React.SetStateAction<{
      sortOrdered: {
        field: string
        order: SORT
      }
      sortDelivered: {
        field: string
        order: SORT
      }
      sortCancelled: {
        field: string
        order: SORT
      }
    }>
  >
}

export default function OrderList({ data, totalItems, pagination, setSortParam }: Props) {
  const { filterItems, columnSetting, activeTab, orderListRq, setOrderListRq, setFilterItems } =
    useContext(FilterContext)
  const { setMany } = useSearchParam()
  const currentListParamsLS = getListParamsFormLS()
  const navigate = useNavigate()

  const { temporaryData, isOpenUndo, timerId, setTemporaryData, setIsOpenUndo, setTimerId } = useUndoOrderStore()
  const { setHeaderData } = useHeaderTitleStore()

  const sortFromLs = {
    field: currentListParamsLS.sort,
    order: currentListParamsLS.order
  }

  const hasFilterItem = useMemo(() => {
    const omitStatusListFilter = {
      ...currentListParamsLS.filter,
      status: ''
    }
    const filterValue = Object.values(omitStatusListFilter)
    return filterValue.some((value) => value !== '')
  }, [currentListParamsLS.filter])

  useEffect(() => {
    if (!timerId) {
      setTemporaryData(data)
    }
  }, [data])

  const { mutate: deleteItemMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteOrders(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  const handleViewCustomerDetail = (customer: Customer) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setHeaderData({
      fullName: `${customer.first_name} ${customer.last_name}`,
      avatar: customer.avatar
    })
    navigate(`${path.customers}/${customer.id}`)
  }

  const columns: TableColumns<Order>[] = useMemo(() => {
    const cloneColumnSetting = cloneDeep(columnSetting[activeTab])

    return cloneColumnSetting
      .filter((col) => col.isVisible)
      .map((col) => {
        const tableColumn = {
          id: col.id,
          label: col.label,
          numeric: col.numeric,
          sortable: true,
          sortBy: col.id
        }

        switch (col.id) {
          case 'returned':
            return {
              ...tableColumn,
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
              sortBy: 'customer_id',
              cell: (_, row) => (
                <Link
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  component='button'
                  onClick={handleViewCustomerDetail(row.customer)}
                >
                  <Avatar sx={{ width: 25, height: 25 }} src={row.customer.avatar} alt={row.customer.first_name} />
                  <Box>{`${row.customer.first_name} ${row.customer.last_name}`}</Box>
                </Link>
              )
            }
          case 'address':
            return {
              ...tableColumn,
              sortable: false,
              cell: (_, row) => row.customer.address
            }

          case 'nb_items':
            return {
              ...tableColumn,
              sortBy: 'basket',
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
    const softDeleteOrder = temporaryData.filter((data) => !deletedIds.includes(data.id))
    setTemporaryData(softDeleteOrder)
    setIsOpenUndo(true)

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      deleteItemMutation(deletedIds)
      setTimerId(null)
    }, 3000)

    setTimerId(timeOut)
  }

  const handleUndo = () => {
    setIsOpenUndo(false)
    setTemporaryData(data)
    clearTimeout(timerId ?? 0)
  }

  const handleViewDetail = (id: number) => {
    navigate(`${path.orders}/${id}`)

    const referenceDetail = temporaryData.find((data) => data.id === id)
    setHeaderData({
      reference: referenceDetail?.reference
    })
  }

  const handleDeleteAllFilter = () => {
    if (!hasFilterItem) return
    return () => {
      const newFilterItem = filterItems.map((item) => {
        return {
          ...item,
          isChecked: false
        }
      })

      setFilterItems(newFilterItem)

      const newDisplayedFilters = cleanObject(
        newFilterItem.reduce((acc, curr) => {
          if (!curr.isChecked) {
            delete currentListParamsLS.filter[curr.key]
          }
          return { ...acc, [curr.key]: curr.isChecked }
        }, {})
      )

      saveListParamsToLS({
        ...currentListParamsLS,
        displayedFilters: newDisplayedFilters,
        filter: currentListParamsLS.filter
      })

      setMany({
        displayedFilters: JSON.stringify(newDisplayedFilters),
        filter: JSON.stringify({ ...currentListParamsLS.filter })
      })
    }
  }

  const handleSort = (field: string, order: SORT) => {
    const sort = {
      field,
      order
    }

    saveListParamsToLS({
      ...currentListParamsLS,
      order,
      sort: field as keyof OrderParams
    })

    setMany({
      sort: JSON.stringify(sort)
    })

    switch (activeTab) {
      case ORDER_STATUS.ORDERED:
        setSortParam((prev) => ({
          ...prev,
          sortOrdered: sort
        }))
        break
      case ORDER_STATUS.DELIVERED:
        setSortParam((prev) => ({
          ...prev,
          sortDelivered: sort
        }))
        break
      case ORDER_STATUS.CANCELLED:
        setSortParam((prev) => ({
          ...prev,
          sortCancelled: sort
        }))
        break
    }
  }

  return (
    <>
      <CustomTable<Order, number>
        rowId='id'
        columns={columns}
        dataSource={temporaryData || []}
        totalItems={totalItems}
        pagination={pagination}
        sortColFromLS={sortFromLs}
        handleSetPage={handleSetPage}
        handleSetRowsPerPage={handleSetRowsPerPage}
        handleDelete={handleDelete}
        onClearAllFilter={handleDeleteAllFilter()}
        onRowClick={handleViewDetail}
        handleSort={handleSort}
      />
      <Snackbar
        open={isOpenUndo}
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
