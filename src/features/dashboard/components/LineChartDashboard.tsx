import { Order } from '@/services/data-generator'
import { formatDate } from '@/utils/date'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

interface Props {
  orderData: Order[]
}

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0
})

export default function LineChartDashboard({ orderData }: Props) {
  const lineData = useMemo(() => {
    const now = new Date()
    const oneMonthAgo = new Date()
    oneMonthAgo.setDate(now.getDate() - 30)

    return orderData
      .filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate <= now && itemDate >= oneMonthAgo
      })
      .map((data) => {
        return {
          date: formatDate(data.date, 'd/M/yyyy'),
          total: data.total
        }
      })
  }, [JSON.stringify(orderData)])

  return (
    <Box
      sx={{
        padding: '16px',
        borderRadius: '10px',
        border: '1px solid rgb(224, 224, 227)'
      }}
    >
      <Typography sx={{ fontSize: '24px', marginBottom: '32px' }}>30 Day Revenue History</Typography>
      <AreaChart width={532} height={300} data={lineData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
        <Tooltip
          content={({ label, payload }) => {
            if (!payload || payload.length === 0) return null
            const value = payload[0].value as number
            const formattedValue = `${value.toLocaleString('en-US', { minimumFractionDigits: 2 })} US$`
            return (
              <Box
                sx={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: 12
                }}
              >
                {`${label} : ${formattedValue}`}
              </Box>
            )
          }}
        />
        <Area type='monotone' dataKey='total' stroke='#8884d8' fill='#8884d8' fillOpacity={0.1} />
      </AreaChart>
    </Box>
  )
}
