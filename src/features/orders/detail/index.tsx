import { queryClient } from '@/App'
import CustomLink from '@/components/CustomLink'
import HookFormSwitch from '@/components/HookFormSwitch'
import TextFieldSelect from '@/components/TextFieldSelect'
import { path } from '@/routers/path'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { yupResolver } from '@hookform/resolvers/yup'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import * as yup from 'yup'
import { detailOrderSchema } from '../schemas'
import { deleteOrders, fetchOrderDetail, updateOrder } from '../services'
import { Order, OrderStatus, UpdateOrderRequest } from '../types'
import { useUndoStore } from '@/store/undoOrderStore'
import { cloneDeep } from 'lodash'

type FormValues = yup.InferType<typeof detailOrderSchema>

export default function DetailOrder() {
  const param = useParams()
  const navigate = useNavigate()
  const { temporaryData, setIsOpenUndo, setTemporaryData, setTimerId } = useUndoStore()

  const methods = useForm<FormValues>({
    resolver: yupResolver(detailOrderSchema),
    defaultValues: {
      status: '',
      returned: true
    }
  })

  const returned = useWatch({ name: 'returned', control: methods.control })
  console.log('🚀 Here we go! ________ returned:', returned)
  const status = useWatch({ name: 'status', control: methods.control })

  const { data: orderDetailData, isFetching } = useQuery({
    queryKey: ['order', param.id],
    queryFn: () => fetchOrderDetail({ id: Number(param.id) }),
    onSuccess: (data) => {
      methods.reset({
        returned: data.data.returned,
        status: data.data.status ?? 'ordered'
      })
    },
    refetchOnWindowFocus: false,
    enabled: !!param.id
  })
  const orderDetail = orderDetailData?.data || ({} as Order)

  const { mutate: deleteOrderMutation } = useMutation({
    mutationFn: (id: number[]) => deleteOrders(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  const { mutate: updateOrderMutation } = useMutation({
    mutationFn: (orderDetail: UpdateOrderRequest) => updateOrder(orderDetail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  // const { data: queryProduct } = useQuery({
  //   queryKey: ['products', orderDetail?.basket[0].product_id],
  //   queryFn: () =>
  //     fetchProductsList({
  //       filter: { price_gt: 5 }
  //     }),
  //   enabled: !!orderDetail?.basket[0]?.product_id
  // })

  const handleSubmit = () => {
    const payload = {
      id: Number(param.id),
      data: {
        ...orderDetail,
        returned,
        status: status as OrderStatus
      }
    }

    setIsOpenUndo(true)

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      updateOrderMutation(payload)
      setTimerId(null)
    }, 3000)

    setTimerId(timeOut)

    navigate(path.orders)
  }

  const handleDelete = () => {
    const cloneData = cloneDeep(temporaryData)
    const newTemporaryData = cloneData.filter((data) => data.id !== Number(param.id))

    setTemporaryData(newTemporaryData)
    setIsOpenUndo(true)

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      deleteOrderMutation([Number(param.id)])
      setTimerId(null)
    }, 3000)

    setTimerId(timeOut)
    navigate(path.orders)
  }

  return (
    <FormProvider {...methods}>
      {isFetching ? (
        'Loading...'
      ) : (
        <Box>
          <Box
            sx={{
              width: '798px',
              padding: 2,
              border: '1px solid #e0e0e0',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px'
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>Order</Typography>
                <Box>
                  <Typography sx={{ fontSize: '12px' }}>Date</Typography>
                  <Typography sx={{ fontSize: '14px' }}>{formatDate(`${orderDetail?.date}`, 'dd/M/yyyy')}</Typography>
                </Box>
                <TextFieldSelect
                  name='status'
                  textFieldLabel='Status'
                  sxTextFiled={{ width: '203px' }}
                  options={[
                    {
                      label: 'ordered',
                      value: 'ordered'
                    },
                    {
                      label: 'delivered',
                      value: 'delivered'
                    },
                    {
                      label: 'cancelled',
                      value: 'cancelled'
                    }
                  ]}
                  hasAllItem
                />
              </Box>

              <Box sx={{ mt: '48px', ml: '42px' }}>
                <Typography sx={{ fontSize: '12px' }}>Reference</Typography>
                <Typography sx={{ fontSize: '14px' }}>{orderDetail?.reference}</Typography>
                <Box sx={{ mt: '20px', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HookFormSwitch name='returned' label='Returned' />
                </Box>
              </Box>

              <Box sx={{ ml: '120px' }}>
                <Typography sx={{ fontWeight: 500, fontSize: '20px', mb: 2 }}>Customer</Typography>
                <CustomLink
                  to={`${path.customers}/${param.id}`}
                >{`${orderDetail?.customer.first_name} ${orderDetail?.customer.last_name}`}</CustomLink>
                <CustomLink to={`mailto:${orderDetail?.customer.email}`}>{orderDetail?.customer.email}</CustomLink>
                <Box sx={{ mt: 4 }}>
                  <Typography sx={{ mb: 1, fontWeight: 500, fontSize: '20px' }}>Shipping Address</Typography>
                  <Typography>{`${orderDetail?.customer.first_name} ${orderDetail?.customer.last_name}`}</Typography>
                  <Typography>{orderDetail?.customer.address}</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 20 }}>Items</Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 20 }}>Totals</Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 2,
                  borderBottom: '1px solid rgb(224, 224, 224)'
                }}
              >
                <Typography sx={{ fontSize: '14px' }}>Sum</Typography>
                <Typography sx={{ fontSize: '14px' }}>{formatCurrency(orderDetail?.total_ex_taxes ?? 0)}</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 2,
                  borderBottom: '1px solid rgb(224, 224, 224)'
                }}
              >
                <Typography sx={{ fontSize: '14px' }}>Delivery</Typography>
                <Typography sx={{ fontSize: '14px' }}>{formatCurrency(orderDetail?.delivery_fees ?? 0)}</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 2,
                  borderBottom: '1px solid rgb(224, 224, 224)'
                }}
              >
                <Typography sx={{ fontSize: '14px' }}>{`Tax (${orderDetail?.tax_rate}%)`}</Typography>
                <Typography sx={{ fontSize: '14px' }}>{formatCurrency(orderDetail?.taxes ?? 0)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>Total</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>
                  {formatCurrency(orderDetail?.total ?? 0)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: '798px',
              padding: '14px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
              disabled={!methods.formState.isDirty}
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
            >
              SAVE
            </Button>

            <Button onClick={handleDelete} sx={{ borderRadius: 1 }} color='error' startIcon={<DeleteIcon />}>
              DELETE
            </Button>
          </Box>
        </Box>
      )}
    </FormProvider>
  )
}
