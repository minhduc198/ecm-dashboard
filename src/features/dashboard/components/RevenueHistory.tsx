import { userData } from '@/data/dashboard/mockUserData'
import { formatDateTime } from '@/utils'
import { Box, Stack, styled, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'

const PendingWrapper = styled('div')({
  border: '1px solid rgb(224, 224, 227)',
  borderRadius: '10px',
  paddingBlock: '16px'
})

function RevenueHistory() {
  const navigate = useNavigate()

  return (
    <PendingWrapper>
      <Typography sx={{ fontSize: '24px', marginBottom: '32px', paddingInline: '16px' }}>Pending Orders</Typography>
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
              <img src={data.avatar} alt='' />
            </Box>
            <Stack sx={{ fontSize: '14px' }}>
              <Box>{formatDateTime(data.date, 'dd/MM/y, HH:mm:ss')}</Box>
              <Box sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                by {data.name}, {data.quantity} {data.quantity > 1 ? 'items' : 'item'}
              </Box>
            </Stack>
          </Box>

          <Box sx={{ color: 'rgba(0, 0, 0, 0.87)', marginRight: '16px' }}>{data.price}$</Box>
        </Box>
      ))}
    </PendingWrapper>
  )
}

export default RevenueHistory
