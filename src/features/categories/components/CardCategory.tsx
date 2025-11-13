import { Category } from '@/services/data-generator'
import { Box, Button } from '@mui/material'
import React from 'react'
import CollectionsIcon from '@mui/icons-material/Collections'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router'
import { getProductListParamsFormLS, saveProductListParamsToLS } from '@/utils/products'
import { path } from '@/routers/path'
import { useHeaderTitleStore } from '@/store/headerStore'

interface Props {
  category: Category
}

export default function CardCategory({ category }: Props) {
  const { setHeaderData } = useHeaderTitleStore()
  const navigate = useNavigate()
  const customerParamFromLS = getProductListParamsFormLS()

  const handleFilterCategories = (category_id: string) => {
    saveProductListParamsToLS({
      ...customerParamFromLS,
      filter: {
        ...customerParamFromLS.filter,
        category_id
      }
    })
    navigate(path.products)
  }

  const handleNavigateDetailCategory = (category_id: number) => {
    setHeaderData({ title: `Category ${category.name}` })
    navigate(`${path.categories}/${category_id}`)
  }

  return (
    <Box
      sx={{
        height: '246px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ height: '140px' }}>
        <img src={category.image} />
      </Box>
      <Box sx={{ fontSize: '24px', mt: 2, textAlign: 'center' }}>
        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
      </Box>
      <Box sx={{ mt: '20px', mb: '12px', ml: '16px', display: 'flex', gap: 1 }}>
        <Button
          sx={{
            fontWeight: 500,
            fontSize: '13px',
            padding: '0 !important',
            '& .MuiButton-startIcon > *:nth-of-type(1)': {
              fontSize: '12px !important'
            }
          }}
          startIcon={<CollectionsIcon />}
          onClick={() => handleFilterCategories(String(category.id))}
        >
          PRODUCTS
        </Button>

        <Button
          sx={{
            fontWeight: 500,
            fontSize: '13px',
            padding: '0 !important',
            '& .MuiButton-startIcon > *:nth-of-type(1)': {
              fontSize: '14px !important'
            }
          }}
          startIcon={<EditIcon />}
          onClick={() => handleNavigateDetailCategory(category.id)}
        >
          EDIT
        </Button>
      </Box>
    </Box>
  )
}
