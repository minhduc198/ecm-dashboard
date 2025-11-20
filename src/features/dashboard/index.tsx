import { ORDER_STATUS } from '@/constants'
import { SORT } from '@/types'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CodeIcon from '@mui/icons-material/Code'
import CommentIcon from '@mui/icons-material/Comment'
import HomeIcon from '@mui/icons-material/Home'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Box, Button, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchOrdersList } from '../orders/services'
import { fetchReviewList } from '../reviews/services'
import { REVIEW_STATUS } from '../reviews/types'
import DashboardCard from './components/DashboardCard'
import LineChartDashboard from './components/LineChartDashboard'
import RevenueHistory from './components/RevenueHistory'
import { useTranslation } from 'react-i18next'

const BannerDashBoard = styled('div')({
  marginBlock: 16,
  height: 187,
  border: '1px solid white',
  borderRadius: 10,
  padding: 20,
  color: 'white',
  background: 'linear-gradient(45deg, rgb(0, 16, 100) 0%, rgb(95, 95, 196) 50%, rgb(55, 42, 140) 100%)'
})

const Dashboard = () => {
  const { data: reviewListData } = useQuery({
    queryKey: ['review_list'],
    queryFn: () => fetchReviewList({ pagination: { page: 1, perPage: 999 } }),
    refetchOnWindowFocus: false
  })
  const reviewList = reviewListData?.data || []
  const reviewPendingList = reviewList.filter((item) => item.status === REVIEW_STATUS.PENDING)

  const { data: orderListData } = useQuery({
    queryKey: ['order_list'],
    queryFn: () => fetchOrdersList({ pagination: { page: 1, perPage: 999 }, sort: { field: 'date', order: SORT.ASC } }),
    refetchOnWindowFocus: false
  })
  const orderList = orderListData?.data || []
  const orderPendingList = orderList.filter((item) => item.status === ORDER_STATUS.ORDERED)

  const newCustomerList = useMemo(() => {
    const now = new Date()
    const fifteenDaysAgo = new Date()
    fifteenDaysAgo.setDate(now.getDate() - 15)

    return reviewPendingList.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= fifteenDaysAgo && itemDate <= now
    })
  }, [reviewPendingList])

  const newOrderList = useMemo(() => {
    const now = new Date()
    const fifteenDaysAgo = new Date()
    fifteenDaysAgo.setDate(now.getDate() - 15)

    return orderPendingList.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= fifteenDaysAgo && itemDate <= now
    })
  }, [reviewPendingList])

  const { t } = useTranslation('dashboard')

  return (
    <Box>
      <BannerDashBoard sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: 24, mb: 1 }}>{t('welcome')}</Typography>
          <Typography sx={{ maxWidth: 640, mb: 2 }}>{t('introText')}</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, fontWeight: 500, fontSize: 14 }}>
            <Button
              startIcon={<HomeIcon />}
              variant='contained'
              sx={{
                color: 'white',
                borderRadius: '10px',
                backgroundColor: '#4f3cc9'
              }}
            >
              {t('reactSite')}
            </Button>
            <Button
              startIcon={<CodeIcon />}
              variant='contained'
              sx={{
                color: 'white',
                borderRadius: '10px',
                backgroundColor: '#4f3cc9'
              }}
            >
              {t('demoSource')}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: 256,
            height: 144,
            background: 'url(https://marmelab.com/react-admin-demo/assets/welcome_illustration-BRGwFvXW.svg)',
            backgroundSize: 'cover'
          }}
        ></Box>
      </BannerDashBoard>

      <Grid container spacing={2}>
        <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} container size={{ xs: 6 }}>
          <Grid container size={{ xs: 12 }}>
            <Grid size={{ xs: 6 }}>
              <DashboardCard
                icon={
                  <AttachMoneyIcon
                    sx={{
                      width: '35px',
                      height: '35px',
                      color: 'rgb(40, 53, 147)'
                    }}
                  />
                }
                title={t('monthlyRevenue')}
                value='5.474US$'
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <DashboardCard
                icon={<ShoppingCartIcon sx={{ width: '35px', height: '35px', color: 'rgb(40, 53, 147)' }} />}
                title={t('newOrders')}
                value={newOrderList?.length ?? 0}
              />
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <LineChartDashboard orderData={orderList ?? []} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <RevenueHistory userData={orderPendingList ?? []} />
          </Grid>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <DashboardCard
            isReview
            icon={<CommentIcon sx={{ width: '35px', height: '35px', color: 'rgb(40, 53, 147)' }} />}
            title={t('pendingReviews')}
            value={reviewPendingList?.length ?? 0}
            data={reviewPendingList}
          />
        </Grid>
        <Grid size={{ xs: 3 }}>
          <DashboardCard
            icon={<PersonAddIcon sx={{ width: '35px', height: '35px', color: 'rgb(40, 53, 147)' }} />}
            title={t('newCustomers')}
            value={newCustomerList?.length ?? 0}
            data={newCustomerList}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
