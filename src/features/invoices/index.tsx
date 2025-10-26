import { queryClient } from '@/App'
import CustomLink from '@/components/CustomLink'
import CustomTable from '@/components/CustomTable'
import { DEFAULT_PAGE } from '@/constants'
import { useSearchParam } from '@/hooks/useSearchParam'
import { path } from '@/routers/path'
import { Customer, Invoice } from '@/services/data-generator'
import { useHeaderTitleStore } from '@/store/headerStore'
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
import { Avatar, Box, Button, Snackbar, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { OrderDetailProduct } from '../orders/types'
import { Product } from '../products/types'
import FilterBarInvoices from './components/FilterBarInvoices'
import { initialInvoiceColumns } from './constant'
import { deleteInvoices, fetchInvoicesList } from './services'
import { GetInvoicesListRequest, InvoiceParam, TableColumnsInvoice } from './types'
import { utils, writeFileXLSX } from 'xlsx'

const Invoices = () => {
  const { setMany } = useSearchParam()
  const { setHeaderData } = useHeaderTitleStore()
  const { action, tmpUndoData, isOpenUndo, timerId, setTmpUndoData, setIsOpenUndo, setTimerId, setAction } =
    useUndoInvoiceStore()
  const { filter, sort, page, order, perPage } = getInvoiceListParamsFormLS()
  const invoiceSettingColFromLS = getInvoicesSettingColumnsFromLS()
  const currentListParamsLS = getInvoiceListParamsFormLS()
  const [invoiceSettingCol, setInvoiceSettingCol] = useState<TableColumnsInvoice>(
    invoiceSettingColFromLS.length ? invoiceSettingColFromLS : initialInvoiceColumns
  )

  const [invoiceListRq, setInvoiceListRq] = useState<GetInvoicesListRequest>({
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

  const handleSetQueryDetail = (row: Customer) => {
    setHeaderData({
      fullName: `${row.first_name} ${row.last_name}`,
      avatar: row.avatar
    })
  }

  const handleSetReference = (reference: string) => {
    setHeaderData({
      reference
    })
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
              cell: (_, row) => (
                <CustomLink
                  to={`${path.customers}/${row.customer_detail.id}`}
                  onClick={() => handleSetQueryDetail(row.customer_detail)}
                >
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar
                      sx={{ width: 25, height: 25 }}
                      src={row.customer_detail.avatar}
                      alt={row.customer_detail.first_name}
                    />
                    <Box>{`${row.customer_detail.first_name} ${row.customer_detail.last_name}`}</Box>
                  </Box>
                </CustomLink>
              )
            }

          case 'customer_detail':
            return {
              ...tableColumn,
              minWidth: 200,
              cell: (_, row) => row.customer_detail.address
            }

          case 'date':
            return {
              ...tableColumn,
              cell: (value) => (typeof value === 'string' ? formatDate(value, 'd/M/yyyy') : null)
            }

          case 'reference':
            return {
              ...tableColumn,
              cell: (_, row) => (
                <CustomLink to={`${path.orders}/${row.order_id}`} onClick={() => handleSetReference(row.reference)}>
                  <Box>{row.reference}</Box>
                </CustomLink>
              )
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

  const columnProductItems: TableColumns<OrderDetailProduct>[] = [
    {
      id: 'reference',
      label: 'Reference',
      cell: (value) => <CustomLink to={'#'}>{value?.toString()}</CustomLink>
    },

    { id: 'price', label: 'Unit price', numeric: true, cell: (value) => formatCurrency(Number(value)) },
    {
      id: 'quantity',
      label: 'Quantity',
      numeric: true,
      cell: (value) => Number(value)
    },
    { id: 'total', label: 'Total', numeric: true, cell: (value) => formatCurrency(Number(value)) }
  ]

  const productItemsDataSource = (productList: Product[]) => {
    return productList.map((product) => {
      const total = (product.quantity ?? 1) * Number(product.price)
      return {
        id: product.id,
        reference: product.reference,
        price: product.price,
        quantity: product.quantity || 0,
        total
      }
    })
  }

  useEffect(() => {
    if (!timerId) {
      setTmpUndoData(invoicesData?.data ?? [])
    }
  }, [invoicesData?.data])

  const handleDeleteInvoices = (ids: number[]) => {
    setAction('Delete Invoices')
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
      perPage: String(rowPerPage)
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
      page: String(page)
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

  const collapsibleContent = (row: Invoice) => {
    return (
      <Box
        sx={{
          width: '598px',
          mt: 1,
          marginInline: 'auto',
          paddingInline: 2,
          pt: 2,
          pb: 3,
          border: '1px solid rgb(0, 0, 0, 0.1)',
          borderRadius: '10px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>Posters Galore</Typography>
          <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>{row.id}</Typography>
        </Box>
        <Box>{`${row.customer_detail.first_name} ${row.customer_detail.last_name}`}</Box>
        <Box>{row.customer_detail.address}</Box>
        <Box sx={{ mt: '20px', mb: '20px', display: 'flex', justifyContent: 'space-around' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>Date</Typography>
            <Typography>{formatDate(row.date, 'd/M/yyyy')}</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>Order</Typography>
            <Typography>{row.reference}</Typography>
          </Box>
        </Box>
        <CustomTable<OrderDetailProduct, number>
          rowId='id'
          usePagination={false}
          selectable={false}
          columns={columnProductItems}
          dataSource={productItemsDataSource(row.products)}
        />
      </Box>
    )
  }

  const handleExport = () => {
    const ids = invoiceSettingCol
      .filter((col) => col.isVisible)
      .map((col) => {
        if (col.id === 'customer_detail') {
          return 'address'
        }
        return col.id
      })

    const exportData = tmpUndoData.map((item) => {
      const obj = {
        id: item.id,
        date: formatDate(item.date, 'HH:mm:ss d/M/yyyy'),
        order_id: item.order_id,
        address: item.customer_detail.address,
        customer_id: item.customer_id,
        total_ex_taxes: formatCurrency(item.total_ex_taxes ?? 0),
        delivery_fees: formatCurrency(item.delivery_fees ?? 0),
        tax_rate: formatCurrency(item.tax_rate ?? 0),
        taxes: formatCurrency(item.taxes ?? 0),
        total: formatCurrency(item.total ?? 0)
      }

      Object.keys(cloneDeep(obj)).forEach((key: string) => {
        if (!ids.includes(key as keyof (Invoice | 'address'))) {
          delete obj[key as keyof typeof obj]
        }
      })

      return obj
    })

    const ws = utils.json_to_sheet(exportData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data')
    writeFileXLSX(wb, `Invoice_list_${formatDate(new Date().toISOString(), 'dMyyyy')}.xlsx`)
  }

  return (
    <Box>
      <FilterBarInvoices
        invoiceListRq={invoiceListRq}
        invoiceSettingCol={invoiceSettingCol}
        setInvoiceListRq={setInvoiceListRq}
        setInvoiceSettingCol={setInvoiceSettingCol}
        handleExport={handleExport}
      />
      <CustomTable<Invoice, number>
        collapsibleTable
        rowId={'id'}
        columns={columns}
        dataSource={tmpUndoData ?? []}
        sortColFromLS={sortFromLs}
        handleSetPage={handleSetPage}
        handleSetRowsPerPage={handleSetRowsPerPage}
        handleSort={handleSort}
        collapsibleContent={collapsibleContent}
        handleDelete={handleDeleteInvoices}
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
