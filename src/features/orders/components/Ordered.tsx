import CustomTable from '@/components/CustomTable'
import { TableColumns } from '@/types/table'
import { getSettingColumnsFromLS } from '@/utils/orders'
import { useContext, useEffect, useMemo, useState } from 'react'
import { FilterContext } from '../context/FilterContext'
import { cloneDeep, partial } from 'lodash'
import { Order } from '@/services/data-generator'

const data = [
  {
    id: 0,
    reference: 'HBDLVF',
    date: '2024-03-04T12:14:12.913Z',
    customer_id: 492,
    basket: [
      {
        product_id: 74,
        quantity: 1
      }
    ],
    total_ex_taxes: 23.37,
    delivery_fees: 3.61,
    tax_rate: 0.2,
    taxes: 5.4,
    total: 32.38,
    status: 'delivered',
    returned: false
  },
  {
    id: 1,
    reference: 'H7UBVA',
    date: '2025-04-12T00:01:47.574Z',
    customer_id: 77,
    basket: [
      {
        product_id: 104,
        quantity: 1
      }
    ],
    total_ex_taxes: 59.46,
    delivery_fees: 6.85,
    tax_rate: 0.2,
    taxes: 13.26,
    total: 79.57,
    status: 'delivered',
    returned: false
  },
  {
    id: 2,
    reference: '8P5OJD',
    date: '2024-09-16T07:37:14.735Z',
    customer_id: 556,
    basket: [
      {
        product_id: 57,
        quantity: 2
      }
    ],
    total_ex_taxes: 85.12,
    delivery_fees: 7.84,
    tax_rate: 0.12,
    taxes: 11.16,
    total: 104.12,
    status: 'cancelled',
    returned: false
  },
  {
    id: 3,
    reference: '6CNZIO',
    date: '2024-01-23T05:17:52.958Z',
    customer_id: 366,
    basket: [
      {
        product_id: 99,
        quantity: 1
      },
      {
        product_id: 92,
        quantity: 1
      },
      {
        product_id: 50,
        quantity: 1
      },
      {
        product_id: 82,
        quantity: 3
      }
    ],
    total_ex_taxes: 181.26,
    delivery_fees: 7.22,
    tax_rate: 0.2,
    taxes: 37.7,
    total: 226.18,
    status: 'delivered',
    returned: true
  },
  {
    id: 4,
    reference: 'YSQGXM',
    date: '2025-05-21T01:53:00.546Z',
    customer_id: 861,
    basket: [
      {
        product_id: 48,
        quantity: 3
      },
      {
        product_id: 100,
        quantity: 1
      }
    ],
    total_ex_taxes: 253.85,
    delivery_fees: 5.99,
    tax_rate: 0.17,
    taxes: 44.17,
    total: 304.01,
    status: 'delivered',
    returned: false
  },
  {
    id: 5,
    reference: 'DBLRH9',
    date: '2024-08-20T15:47:03.587Z',
    customer_id: 871,
    basket: [
      {
        product_id: 68,
        quantity: 1
      }
    ],
    total_ex_taxes: 23.95,
    delivery_fees: 7.24,
    tax_rate: 0.2,
    taxes: 6.24,
    total: 37.43,
    status: 'delivered',
    returned: false
  },
  {
    id: 6,
    reference: 'UZEXGI',
    date: '2025-03-19T04:59:51.440Z',
    customer_id: 44,
    basket: [
      {
        product_id: 80,
        quantity: 1
      },
      {
        product_id: 0,
        quantity: 5
      }
    ],
    total_ex_taxes: 224.67,
    delivery_fees: 4.57,
    tax_rate: 0.2,
    taxes: 45.85,
    total: 275.09,
    status: 'delivered',
    returned: false
  },
  {
    id: 7,
    reference: 'V58EMY',
    date: '2025-07-07T03:19:41.618Z',
    customer_id: 870,
    basket: [
      {
        product_id: 87,
        quantity: 1
      }
    ],
    total_ex_taxes: 67.14,
    delivery_fees: 5.14,
    tax_rate: 0.17,
    taxes: 12.29,
    total: 84.57,
    status: 'delivered',
    returned: false
  },
  {
    id: 8,
    reference: 'IHVSPR',
    date: '2025-01-30T04:21:37.381Z',
    customer_id: 686,
    basket: [
      {
        product_id: 99,
        quantity: 1
      }
    ],
    total_ex_taxes: 58.15,
    delivery_fees: 5.97,
    tax_rate: 0.2,
    taxes: 12.82,
    total: 76.94,
    status: 'delivered',
    returned: false
  },
  {
    id: 9,
    reference: 'YESVIR',
    date: '2024-05-29T01:06:34.009Z',
    customer_id: 132,
    basket: [
      {
        product_id: 10,
        quantity: 1
      },
      {
        product_id: 50,
        quantity: 5
      },
      {
        product_id: 71,
        quantity: 1
      },
      {
        product_id: 94,
        quantity: 4
      }
    ],
    total_ex_taxes: 316.61,
    delivery_fees: 4.92,
    tax_rate: 0.17,
    taxes: 54.66,
    total: 376.19,
    status: 'delivered',
    returned: false
  }
]

export default function Ordered() {
  const { columnSetting, activeTab } = useContext(FilterContext)

  const [columns, setColumns] = useState<TableColumns<(typeof data)[0]>[]>([])

  useEffect(() => {
    const cloneColumnSetting = cloneDeep(columnSetting[activeTab])
    const newColumnSetting = cloneColumnSetting
      .filter((col) => col.isVisible)
      .map((col) => ({
        id: col.id as keyof (typeof data)[0],
        label: col.label
      }))

    setColumns(newColumnSetting)
  }, [JSON.stringify(columnSetting[activeTab])])

  return (
    <CustomTable<(typeof data)[0]>
      columns={columns}
      dataSource={data}
      handleSetPage={() => {}}
      handleSetRowsPerPage={() => {}}
      handleAccept={() => {}}
      handleDelete={() => {}}
      handleReject={() => {}}
      page={0}
      rowsPerPage={10}
    />
  )
}

// id: 'total',
// label: 'Total'
// cellRender: (value, data) => formatCurrency(value)
