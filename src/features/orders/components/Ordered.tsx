import CustomTable from '@/components/CustomTable'
import { DEFAULT_PAGE } from '@/constants'
import { useSearchParam } from '@/hooks/useSearchParam'
import { IPagination } from '@/types'
import { TableColumns } from '@/types/table'
import { getListParamsFormLS, saveListParamsToLS } from '@/utils/orders'
import { cloneDeep } from 'lodash'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { FilterContext } from '../context/FilterContext'
import { Order } from '../types'
import { Box } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { formatCurrency } from '@/utils/currency'
import { format, parseISO } from 'date-fns'

interface Props {
  data: Order[]
  totalItems: number
  pagination: IPagination
}

export default function Ordered({ data, totalItems, pagination }: Props) {
  const { columnSetting, activeTab, orderListRq, setOrderListRq } = useContext(FilterContext)
  const { setMany } = useSearchParam()
  const currentListParamsLS = getListParamsFormLS()
  const [columns, setColumns] = useState<TableColumns<Order>[]>([])

  /**
   * cell: (value: ? , row: ?) => {}
   * Check nếu có cell thì hiển thị theo cell, không thì theo id (logic ban đầu)
   * Áp dụng: format date, nb_items = basket.length, format currency, returned
   */

  useEffect(() => {
    const cloneColumnSetting = cloneDeep(columnSetting[activeTab])

    const newColumnSetting = cloneColumnSetting
      .filter((col) => col.isVisible)
      .map((col) => ({
        id: col.id,
        label: col.label,
        cellRender: (value: ReactNode, row: TableColumns<Order>) => {
          switch (row.id) {
            case 'returned':
              return value ? <CheckIcon /> : <ClearIcon />

            case 'taxes':
            case 'total':
            case 'delivery_fees':
            case 'total_ex_taxes':
              return <Box sx={{ minWidth: '73px' }}>{formatCurrency(Number(value))}</Box>

            case 'date':
              const date = parseISO(String(value))
              return <Box>{format(date, 'HH:mm:ss d/M/yyyy')}</Box>

            default:
              return <Box>{value}</Box>
          }
        }
      }))

    setColumns(newColumnSetting)
  }, [JSON.stringify(columnSetting[activeTab])])

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
  }

  return (
    <CustomTable<Order>
      columns={columns}
      dataSource={data || []}
      handleSetPage={handleSetPage}
      handleSetRowsPerPage={handleSetRowsPerPage}
      handleAccept={() => {}}
      handleDelete={() => {}}
      handleReject={() => {}}
      totalItems={totalItems}
      page={pagination.page}
      rowsPerPage={pagination.perPage}
    />
  )
}
