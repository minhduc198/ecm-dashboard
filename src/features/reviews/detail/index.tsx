import { Avatar, Box, Button, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import CustomLink from '@/components/CustomLink'
import { useQuery } from '@tanstack/react-query'
import { fetchReviewDetail } from '../services'
import { useParams } from 'react-router'

export default function DetailReview() {
  const param = useParams()
  const { data: reviewDetailData } = useQuery({
    queryKey: ['review_detail', param.id],
    queryFn: () => fetchReviewDetail({ id: Number(param.id) })
  })
  const reviewDetail = reviewDetailData?.data
  console.log('🚀 Here we go! ________ reviewDetail:', reviewDetail)

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>Review detail</Typography>
        <Box sx={{ padding: '4px', '&:hover': { bgcolor: 'red' } }}>
          <CloseIcon sx={{ lineHeight: '1 !important' }} color='action'></CloseIcon>
        </Box>
      </Box>

      <Box
        sx={{ mt: 2, display: 'flex', gap: 4, alignItems: 'center', width: '220px', justifyContent: 'space-between' }}
      >
        <Box>
          <Typography sx={{ fontSize: '13px', color: 'rgb(0,0,0, 0.6)' }}>Customer</Typography>
          <CustomLink to={``}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Avatar sx={{ width: 25, height: 25 }} src={''} alt={''} />
              <Box>{`${11} ${22}`}</Box>
            </Box>
          </CustomLink>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '13px', color: 'rgb(0,0,0, 0.6)' }}>Product</Typography>
          <CustomLink to={``}>
            <Box>{`${11} ${22}`}</Box>
          </CustomLink>
        </Box>
      </Box>

      <Box
        sx={{ mt: 2, display: 'flex', gap: 4, alignItems: 'center', width: '220px', justifyContent: 'space-between' }}
      >
        <Box>
          <Typography sx={{ fontSize: '13px', color: 'rgb(0,0,0, 0.6)' }}>Date</Typography>
          <>ngay</>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '13px', color: 'rgb(0,0,0, 0.6)' }}>Rating</Typography>
          <>rating</>
        </Box>
      </Box>

      <>comment</>
    </Box>
  )
}
