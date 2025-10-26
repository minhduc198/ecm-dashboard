import TextFieldAutoComplete from '@/components/TextFieldAutocomplete'
import TextFieldAutocompleteVirtualized from '@/components/TextFieldAutocompleteVirtualized'
import { yupResolver } from '@hookform/resolvers/yup'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Rating, styled, Typography } from '@mui/material'
import { FormProvider, Resolver, useForm, useWatch } from 'react-hook-form'
import { createReviewSchema } from '../schemas'
import { InferType } from 'yup'
import { useInfiniteCustomers } from '@/hooks/useInfiniteCustomers'
import { useEffect, useState } from 'react'
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts'
import CustomDatePicker from '@/components/CustomDatePicker'
import TextFieldInput from '@/components/TextFieldInput'
import { useLocation, useNavigate } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CreateReviewRequest, REVIEW_STATUS } from '../types'
import { createReview } from '../services'
import { queryClient } from '@/App'
import { path } from '@/routers/path'
import CustomRating from '@/components/CustomRating'
import { GetCustomerDetailRequest } from '@/features/customers/types'
import { fetchCustomerDetail } from '@/features/customers/service'

type FormValues = InferType<typeof createReviewSchema>

export default function CreateReview() {
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const location = useLocation()
  const { product_id } = location.state || {}
  const navigate = useNavigate()

  const methods = useForm({
    resolver: yupResolver(createReviewSchema) as Resolver<FormValues>,
    defaultValues: {
      date: '',
      comment: '',
      rating: 2,
      product_id
    }
  })

  const customer_id = useWatch({ name: 'customer_id', control: methods.control })

  const {
    formState: { isDirty },
    handleSubmit
  } = methods

  const { mutateAsync: createReviewMutation, isPending } = useMutation({
    mutationFn: (param: CreateReviewRequest) => createReview(param),
    onSuccess: () => {
      navigate(`${path.products}/${product_id}/reviews`)
    }
  })

  const { data: detailCustomer } = useQuery({
    queryKey: ['customer_detail'],
    queryFn: () => fetchCustomerDetail({ id: customer_id }),
    enabled: !!customer_id
  })
  const detailCustomerData = detailCustomer?.data

  const {
    customerOptions,
    hasNextPage,
    loadMore,
    isLoading: isLoadingCustomers
  } = useInfiniteCustomers({
    searchTerm: customerSearchTerm
  })

  const {
    productOptions,
    hasNextPage: hasNextPageProduct,
    loadMore: loadMoreProduct,
    isLoading: isLoadingProduct
  } = useInfiniteProducts({
    id: product_id,
    searchTerm: productSearchTerm
  })

  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearchTerm(searchTerm)
  }

  const handleProductSearch = (searchTerm: string) => {
    setProductSearchTerm(searchTerm)
  }

  const onSubmit = (formData: FormValues) => {
    createReviewMutation({
      data: {
        ...formData,
        status: REVIEW_STATUS.PENDING,
        customer: detailCustomerData
      }
    })
  }

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '36px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            padding: 2,
            paddingBottom: 4
          }}
        >
          <TextFieldAutocompleteVirtualized
            isRequired
            label='Customer'
            name='customer_id'
            sxAutocomplete={{ width: '40%' }}
            options={customerOptions}
            hasNextPage={hasNextPage}
            isLoading={isLoadingCustomers}
            onSearch={handleCustomerSearch}
            loadMore={loadMore}
          />
          <TextFieldAutocompleteVirtualized
            isRequired
            name='product_id'
            label='Product'
            isDisabled={!!product_id}
            sxAutocomplete={{ width: '40%' }}
            options={productOptions}
            hasNextPage={hasNextPageProduct}
            isLoading={isLoadingProduct}
            onSearch={handleProductSearch}
            loadMore={loadMoreProduct}
          />

          <CustomDatePicker isRequired name='date' datePickerLabel='Date' sxDatePicker={{ width: '40%' }} />

          <Box>
            <Typography>Rating</Typography>
            <CustomRating name='rating' />
          </Box>

          <TextFieldInput isRequired name='comment' label='Comment' sxTextFieldInput={{ width: '40%' }} />
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 24px',
            borderInline: '1px solid #e0e0e0',
            borderBottom: '1px solid #e0e0e0',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            bgcolor: '#e0e0e0'
          }}
        >
          <Button
            sx={{ borderRadius: '8px' }}
            type='submit'
            variant='contained'
            disabled={!isDirty}
            loading={isPending}
            startIcon={<SaveIcon />}
          >
            SAVE
          </Button>
        </Box>
      </form>
    </FormProvider>
  )
}
