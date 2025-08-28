import { ORDER_STATUS } from '@/constants'
import { fetchOrdersList } from '@/features/orders/services'
import { fetchProductsList } from '@/features/products/services'
import { fetchReviewsList } from '@/features/reviews/services'
import { path } from '@/routers/path'
import { useOrderStore } from '@/store/orderStore'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { getListParamsFormLS, saveListParamsToLS } from '@/utils/orders'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CommentIcon from '@mui/icons-material/Comment'
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder'
import StarsIcon from '@mui/icons-material/Stars'
import { Box, Grid, Link, styled, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import FormCustomer from '../components/FormCustomer'
import { fetchCustomerDetail } from '../service'

const DetailTypography = styled(Typography)({
  fontSize: '14px',
  color: 'rgba(0,0,0, 0.6)'
})

export default function DetailCustomer() {
  const param = useParams()
  const navigate = useNavigate()
  const currentListParamsLS = getListParamsFormLS()

  const { data: customerDetailData, isFetching } = useQuery({
    queryKey: ['customer_detail', param.id],
    queryFn: () => fetchCustomerDetail({ id: Number(param.id) }),
    refetchOnWindowFocus: false,
    enabled: !!param.id
  })
  const customerData = customerDetailData?.data

  const { data: orderListData } = useQuery({
    queryKey: ['order_list', param.id, customerData?.id],
    queryFn: () =>
      fetchOrdersList({
        filter: { customer_id: customerData?.id },
        pagination: {
          page: 1,
          perPage: 9999
        }
      }),
    enabled: !!customerData?.id,
    refetchOnWindowFocus: false
  })
  const orderData = orderListData?.data ?? []

  const { data: reviewListData } = useQuery({
    queryKey: ['review_list', param.id, customerData?.id],
    queryFn: () => fetchReviewsList({ filter: { customer_id: customerData?.id }, page: 1, perPage: 9999 }),
    enabled: !!customerData?.id,
    refetchOnWindowFocus: false
  })
  const reviewData = reviewListData?.data
  const reviewIds = reviewData?.map((order) => {
    return order.product_id
  })

  const { data: productListData } = useQuery({
    queryKey: ['product_list', param.id, reviewIds],
    queryFn: () => fetchProductsList({ filter: { id: reviewIds }, page: 1, perPage: 9999 })
  })
  const productData = productListData?.data

  const ratingStar = (star: number) => {
    return Array(5)
      .fill(0)
      .map((_, idx) => {
        if (idx + 1 <= star) {
          return <StarsIcon sx={{ width: '20px', height: '20px' }} color='action' key={idx} />
        }
        return <Box key={idx}></Box>
      })
  }

  const goToOrderOfCustomer = () => {
    const searchParams = {
      displayedFilters: {
        customer_id: true
      },
      filter: {
        customer_id: customerData?.id,
        status: ORDER_STATUS.DELIVERED
      }
    }

    saveListParamsToLS({
      ...currentListParamsLS,
      ...searchParams
    })

    const queryString = `displayedFilters=${JSON.stringify(searchParams.displayedFilters)}&filter=${JSON.stringify(searchParams.filter)}`
    navigate(`${path.orders}?${queryString}`)
  }

  const handleDeleteCustomer = () => {}

  return (
    <Box>
      {isFetching ? (
        'loading'
      ) : (
        <Grid container spacing={2}>
          <FormCustomer hasStats customerData={customerData} size={9} />
          <Grid size={{ xs: 3 }} container direction={'column'}>
            <Box sx={{ pt: 2, pr: 2, pl: 2, pb: 3, borderRadius: '10px', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: '7px' }}>History</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'start' }}>
                  <Box sx={{ display: 'flex', width: '50%', gap: 1, alignItems: 'start' }}>
                    <QueryBuilderIcon sx={{ width: '20px', height: '20px' }} color='disabled' />
                    <Box sx={{ fontSize: '14px' }}>
                      First seen {formatDate(String(customerData?.first_seen), 'd/M/yyyy')}
                    </Box>
                  </Box>
                  {!!customerData?.nb_orders && (
                    <Box sx={{ display: 'flex', width: '50%', gap: 1, alignItems: 'start' }}>
                      <AttachMoneyIcon sx={{ width: '20px', height: '20px' }} color='disabled' />
                      <Box sx={{ cursor: 'pointer' }} onClick={goToOrderOfCustomer}>
                        <Link sx={{ fontSize: '14px' }}>
                          {`${customerData.nb_orders} ${customerData.nb_orders > 1 ? 'orders' : 'order'}`}
                        </Link>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'start' }}>
                  <Box sx={{ display: 'flex', width: '50%', gap: 1, alignItems: 'start' }}>
                    <QueryBuilderIcon sx={{ width: '20px', height: '20px' }} color='disabled' />
                    <Box sx={{ fontSize: '14px' }}>
                      Last seen {formatDate(String(customerData?.last_seen), 'd/M/yyyy')}
                    </Box>
                  </Box>
                  {!!reviewData?.length && (
                    <Box sx={{ display: 'flex', width: '50%', gap: 1, alignItems: 'start' }}>
                      <CommentIcon sx={{ width: '20px', height: '20px' }} color='disabled' />
                      <Link href={'#'} sx={{ fontSize: '14px' }}>
                        {`${reviewData.length} ${reviewData.length > 1 ? 'reviews' : 'review'}`}
                      </Link>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {!!reviewData?.length &&
              reviewData.map((review) => (
                <Box key={review.id} sx={{ paddingInline: 2 }}>
                  <Box sx={{ display: 'flex', paddingBlock: 1 }}>
                    <CommentIcon sx={{ width: '20px', height: '20px' }} color='disabled' />
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, ml: '4px' }}>
                      {productData?.map((product) => {
                        if (review.product_id === product.id) {
                          return `Posted review on "${product.reference}"`
                        }
                        return
                      })}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      pb: 3,
                      pl: '20px',
                      ml: '10px',
                      borderLeft: '1px solid rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <DetailTypography>{formatDate(review.date, 'E d, y, H:mm a')}</DetailTypography>
                    <DetailTypography>{review.comment}</DetailTypography>
                    <Box sx={{ display: 'flex' }}>{ratingStar(review.rating)}</Box>
                  </Box>
                </Box>
              ))}

            {orderData &&
              orderData.map((order, idx) => (
                <Box key={order.id} sx={{ paddingInline: 2 }}>
                  <Box sx={{ display: 'flex', paddingBlock: 1 }}>
                    <AttachMoneyIcon sx={{ width: '20px', height: '20px' }} color='disabled' />
                    <Typography
                      sx={{ fontSize: '14px', fontWeight: 500 }}
                    >{`Ordered ${order.basket.length} ${order.basket.length > 1 ? 'posters' : 'poster'}`}</Typography>
                  </Box>
                  <Box
                    sx={[
                      {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        pb: 3,
                        pl: '20px',
                        ml: '10px',
                        borderLeft: '1px solid rgba(0, 0, 0, 0.2)'
                      },
                      orderData.length === idx + 1 && { borderLeft: 'none' }
                    ]}
                  >
                    <DetailTypography>{formatDate(order.date, 'E d, y, H:mm a')}</DetailTypography>
                    <DetailTypography>
                      Reference #{order.reference} - {order.status}
                    </DetailTypography>
                    <DetailTypography>{formatCurrency(order.total)}</DetailTypography>
                  </Box>
                </Box>
              ))}
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
