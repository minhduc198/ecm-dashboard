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
import { useContext, useMemo } from 'react'
import { FilterContext } from '../context/FilterContext'
import { Order } from '../types'

interface Props {
  data: Order[]
  totalItems: number
  pagination: IPagination
}

export default function Ordered({ data, totalItems, pagination }: Props) {
  const { columnSetting, activeTab, orderListRq, setOrderListRq } = useContext(FilterContext)
  const { setMany } = useSearchParam()
  const currentListParamsLS = getListParamsFormLS()

  const columns: TableColumns<Order>[] = useMemo(() => {
    const cloneColumnSetting = cloneDeep(columnSetting[activeTab])
    return cloneColumnSetting
      .filter((col) => col.isVisible)
      .map((col) => {
        const tableColumn = {
          id: col.id,
          label: col.label
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

  return (
    <CustomTable<Order>
      rowId='id'
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
