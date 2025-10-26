import { queryClient } from '@/App'
import { path } from '@/routers/path'
import { formatCurrency } from '@/utils/currency'
import { Box, ImageList, ImageListItem, Typography } from '@mui/material'
import { Link } from 'react-router'
import { Product } from '../types'
import { useHeaderTitleStore } from '@/store/headerStore'

interface Props {
  itemData: Product[]
}

export default function ProductCard({ itemData }: Props) {
  const { setHeaderData } = useHeaderTitleStore()

  const handleViewDetail = (item: Product) => {
    queryClient.setQueryData(['product_detail', item.id.toString()], { data: item })
    setHeaderData({
      reference: item.reference
    })
  }

  return (
    <ImageList sx={{ width: '100%', height: '100%', marginBlock: 0 }} cols={5} rowHeight={164}>
      {itemData.map((item) => (
        <Link to={`${path.products}/${item.id}`} key={item.id}>
          <Box onClick={() => handleViewDetail(item)}>
            <ImageListItem sx={{ cursor: 'pointer' }}>
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
          </Box>
        </Link>
      ))}
    </ImageList>
  )
}
