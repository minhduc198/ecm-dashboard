import { Box, ImageList, ImageListItem, Typography } from '@mui/material'
import React from 'react'
import { Product } from '../types'
import { formatCurrency } from '@/utils/currency'

interface Props {
  itemData: Product[]
}

export default function ProductCard({ itemData }: Props) {
  return (
    <ImageList sx={{ width: '100%', height: '100%', marginBlock: 0 }} cols={5} rowHeight={164}>
      {itemData.map((item) => (
        <ImageListItem sx={{ cursor: 'pointer' }} key={item.id}>
          <img
            srcSet={`${item.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.image}?w=164&h=164&fit=crop&auto=format`}
            alt={item.thumbnail}
            loading='lazy'
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '100%',
              padding: '12px 16px',
              background:
                'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0) 100%)'
            }}
          >
            <Typography sx={{ color: 'white' }}>{item.reference}</Typography>
            <Typography
              sx={{ color: 'white', fontSize: '12px' }}
            >{`${item.width}x${item.height}, ${formatCurrency(item.price)}`}</Typography>
          </Box>
        </ImageListItem>
      ))}
    </ImageList>
  )
}
