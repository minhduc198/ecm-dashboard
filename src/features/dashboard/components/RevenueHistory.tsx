import { Order } from '@/services/data-generator'
import { formatDateTime } from '@/utils'
import { Box, Stack, styled, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

interface Props {
  userData: Order[]
}

const PendingWrapper = styled('div')({
  border: '1px solid rgb(224, 224, 227)',
  borderRadius: '10px',
  paddingBlock: '16px'
})

function RevenueHistory({ userData }: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation('dashboard')

  return (
    <PendingWrapper>
      <Typography sx={{ fontSize: '24px', marginBottom: '32px', paddingInline: '16px' }}>
        {t('pendingOrders')}
      </Typography>
      {userData.map((data) => (
        <Box
          onClick={() => navigate(`orders/${data.id}`)}
          key={data.id}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 16px',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '100%',
                marginRight: '16px',
                overflow: 'hidden'
              }}
            >
              <img src={data.customer.avatar} alt='' />
            </Box>
            <Stack sx={{ fontSize: '14px' }}>
              <Box>{formatDateTime(data.date, 'dd/MM/y, HH:mm:ss')}</Box>
              <Box sx={{ opacity: 0.7 }}>
                {`${t('by')} ${data.customer.first_name} ${data.customer.last_name}, ${data.basket.length} ${data.basket.length > 1 ? t('items') : t('item')}`}
              </Box>
            </Stack>
          </Box>

          <Box sx={{ opacity: 0.8, marginRight: '16px' }}>{data.total}$</Box>
        </Box>
      ))}
    </PendingWrapper>
  )
}

export default RevenueHistory
