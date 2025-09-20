import { queryClient } from '@/App'
import CustomTable from '@/components/CustomTable'
import { DEFAULT_PAGE } from '@/constants'
import { useSearchParam } from '@/hooks/useSearchParam'
import { Invoice } from '@/services/data-generator'
import { useUndoInvoiceStore } from '@/store/undoInvocieStore'
import { SORT } from '@/types'
import { TableColumns } from '@/types/table'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import {
  getInvoiceListParamsFormLS,
  getInvoicesSettingColumnsFromLS,
  saveInvoiceListParamsToLS
} from '@/utils/invoices'
import { Box, Button, Snackbar } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import FilterBarInvoices from './components/FilterBarInvoices'
import { initialInvoiceColumns } from './constant'
import { deleteInvoices, fetchInvoicesList } from './services'
import { GetInvoicesListRequest, InvoiceParam, TableColumnsInvoice } from './types'

const Invoices = () => {
  const { setMany } = useSearchParam()
  const { action, tmpUndoData, isOpenUndo, timerId, setTmpUndoData, setIsOpenUndo, setTimerId, setAction } =
    useUndoInvoiceStore()
  const { filter, sort, page, order, perPage } = getInvoiceListParamsFormLS()
  const invoiceSettingColFromLS = getInvoicesSettingColumnsFromLS()
  const currentListParamsLS = getInvoiceListParamsFormLS()
  const [invoiceSettingCol, setInvoiceSettingCol] = useState<TableColumnsInvoice>(
    invoiceSettingColFromLS.length ? invoiceSettingColFromLS : initialInvoiceColumns
  )

  const [invoiceListRq, setInvoiceListRq] = useState<GetInvoicesListRequest>({
    filter: filter as GetInvoicesListRequest['filter'],
    sort: {
      field: sort,
      order
    },
    pagination: {
      page: page + 1,
      perPage
    }
  })

  const { data: invoicesData } = useQuery({
    queryKey: ['invoice_list', invoiceListRq],
    queryFn: () => fetchInvoicesList(invoiceListRq),
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  const { mutate: deleteInvoicesMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteInvoices({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice_list'] })
    }
  })

  const sortFromLs = {
    field: currentListParamsLS.sort,
    order: currentListParamsLS.order
  }

  const columns: TableColumns<Invoice>[] = useMemo(() => {
    const cloneColumnSetting = cloneDeep(invoiceSettingCol)

    return cloneColumnSetting
      .filter((col) => col.isVisible)
      .map((col) => {
        const tableColumn: TableColumns<Invoice> = {
          id: col.id,
          label: col.label,
          numeric: col.numeric,
          sortable: true,
          sortBy: col.id
        }

        switch (col.id) {
          case 'customer_id':
            return {
              ...tableColumn,
              minWidth: 200,
              cell: (_, row) => `${row.customerDetail.first_name} ${row.customerDetail.last_name}`
            }

          case 'customerDetail':
            return {
              ...tableColumn,
              minWidth: 200,
              cell: (_, row) => row.customerDetail.address
            }

          case 'date':
            return {
              ...tableColumn,
              cell: (value) => (typeof value === 'string' ? formatDate(value, 'd/M/yyyy') : null)
            }

          case 'delivery_fees':
            return {
              ...tableColumn,
              cell: (value) => formatCurrency(Number(value ?? 0))
            }

          case 'taxes':
            return {
              ...tableColumn,
              cell: (value) => formatCurrency(Number(value ?? 0))
            }

          case 'total_ex_taxes':
            return {
              ...tableColumn,
              cell: (value) => formatCurrency(Number(value ?? 0))
            }

          case 'total':
            return {
              ...tableColumn,
              cell: (value) => formatCurrency(Number(value ?? 0))
            }

          default:
            return tableColumn
        }
      })
  }, [invoiceSettingCol])

  useEffect(() => {
    if (!timerId) {
      setTmpUndoData(invoicesData?.data ?? [])
    }
  }, [invoicesData?.data])

  const handleDeleteInvoices = (ids: number[]) => {
    if (setAction) {
      setAction('Delete Invoices')
    }
    const softDeleteOrder = invoicesData?.data.filter((data) => !ids.includes(data.id))
    setTmpUndoData(softDeleteOrder ?? [])
    setIsOpenUndo(true)

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      deleteInvoicesMutation(ids)
      setTimerId(null)
    }, 3000)

    setTimerId(timeOut)
  }

  const handleUndo = () => {
    setIsOpenUndo(false)
    setTimerId(null)
    setTmpUndoData(invoicesData?.data ?? [])
    if (timerId) {
      clearTimeout(timerId)
    }
  }

  const handleSetRowsPerPage = (rowPerPage: number) => {
    saveInvoiceListParamsToLS({
      ...currentListParamsLS,
      page: DEFAULT_PAGE,
      perPage: rowPerPage
    })
    setInvoiceListRq({
      ...invoiceListRq,
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
    saveInvoiceListParamsToLS({
      ...currentListParamsLS,
      page,
      perPage: invoiceListRq.pagination.perPage
    })

    setInvoiceListRq({
      ...invoiceListRq,
      pagination: {
        perPage: invoiceListRq.pagination.perPage,
        page: page + 1
      }
    })

    setMany({
      page: JSON.stringify(page)
    })
  }

  const handleSort = (field: string, order: SORT) => {
    const sort = {
      field,
      order
    }

    setMany({ sort: JSON.stringify(sort) })

    setInvoiceListRq({
      ...invoiceListRq,
      sort: {
        field,
        order
      }
    })

    saveInvoiceListParamsToLS({
      ...currentListParamsLS,
      order,
      sort: field as keyof InvoiceParam
    })
  }

  return (
    <Box>
      <FilterBarInvoices
        invoiceListRq={invoiceListRq}
        invoiceSettingCol={invoiceSettingCol}
        setInvoiceListRq={setInvoiceListRq}
        setInvoiceSettingCol={setInvoiceSettingCol}
      />
      <CustomTable<Invoice, number>
        rowId={'id'}
        columns={columns}
        dataSource={tmpUndoData ?? []}
        handleDelete={handleDeleteInvoices}
        handleSetPage={handleSetPage}
        handleSetRowsPerPage={handleSetRowsPerPage}
        handleSort={handleSort}
        sortColFromLS={sortFromLs}
        // onRowClick={handleViewCustomerDetail}
        pagination={{
          page,
          perPage
        }}
        totalItems={invoicesData?.total}
      />
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

export default Invoices
