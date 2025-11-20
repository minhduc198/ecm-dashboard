import TextLineClamp from '@/components/TextLineClamp'
import { path } from '@/routers/path'
import { Review } from '@/services/data-generator'
import StarsIcon from '@mui/icons-material/Stars'
import { Box, styled, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

interface Props {
  icon: ReactNode
  title: string
  value: number | string
  isReview?: boolean
  data?: Review[]
}

const DashBoardCardHeader = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  height: '88px',
  overflow: 'hidden',
  border: '1px solid rgb(224, 224, 227)',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative'
}))

export default function DashboardCard({ icon, title, value, data, isReview = false }: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation('dashboard')

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

  return (
    <Box>
      <DashBoardCardHeader
        sx={{ borderBottomRightRadius: data?.length && '0px', borderBottomLeftRadius: data?.length && '0px' }}
      >
        <Box
          sx={{
            backgroundColor: '#dee1ef',
            borderRadius: '100%',
            position: 'absolute',
            top: '50%',
            left: 0,
            height: '200%',
            aspectRatio: '1/1',
            zIndex: -1,
            transform: 'translate(-30%, -60%)'
          }}
        ></Box>

        <Box>{icon}</Box>

        <Box>
          <Typography sx={{ opacity: 0.7 }}>{title}</Typography>
          <Typography sx={{ fontSize: 24, textAlign: 'end' }}>{value}</Typography>
        </Box>
      </DashBoardCardHeader>
      {data?.length && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgb(224, 224, 227)',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
            borderTop: '0px'
          }}
        >
          {data.map((item) => (
            <Box
              onClick={() => navigate(isReview ? `reviews/${item.id}` : `customers/${item.id}`)}
              key={item.id}
              sx={{
                display: 'flex',
                cursor: 'pointer',
                gap: '16px',
                padding: '16px',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.04)'
                },
                alignItems: isReview ? 'start' : 'center'
              }}
            >
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '100%',
                  marginRight: '16px',
                  overflow: 'hidden',
                  flexShrink: '0'
                }}
              >
                <img src={item.customer.avatar} alt='' />
              </Box>

              {isReview ? (
                <Box>
                  {ratingStar(item.rating)}
                  <TextLineClamp sxTextLineClamp={{ opacity: 0.7, fontSize: '14px' }} line={2}>
                    {item.comment}
                  </TextLineClamp>
                </Box>
              ) : (
                <Box>{`${item.customer.first_name} ${item.customer.last_name}`}</Box>
              )}
            </Box>
          ))}
          <Box
            onClick={() => navigate(isReview ? path.reviews : path.customers)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              color: '#4f3cc9',
              fontWeight: 500,
              paddingBlock: '13px',
              mt: '11px',
              fontSize: '13px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f8f7fd'
              },
              transition: '0.2s all ease'
            }}
          >
            {isReview ? t('seeAllReviews') : t('seeAllCustomers')}
          </Box>
        </Box>
      )}
    </Box>
  )
}
