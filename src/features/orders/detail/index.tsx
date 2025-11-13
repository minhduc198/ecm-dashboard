import { queryClient } from '@/App'
import CustomLink from '@/components/CustomLink'
import HookFormSwitch from '@/components/HookFormSwitch'
import TextFieldSelect from '@/components/TextFieldSelect'
import { ORDER_STATUS } from '@/constants'
import { fetchCustomerDetail } from '@/features/customers/service'
import { path } from '@/routers/path'
import { useHeaderTitleStore } from '@/store/headerStore'
import { useUndoOrderStore } from '@/store/undoOrderStore'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { yupResolver } from '@hookform/resolvers/yup'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import * as yup from 'yup'
import { detailOrderSchema } from '../schemas'
import { deleteOrders, fetchOrderDetail, updateOrder } from '../services'
import { Order, OrderDetailProduct, OrderStatus, UpdateOrderRequest } from '../types'
import { fetchProductsList } from '@/features/products/services'
import CustomTable from '@/components/CustomTable'
import { TableColumns } from '@/types/table'
import { ReactNode, useContext, useMemo } from 'react'
import { FilterContext } from '../context/FilterContext'

type FormValues = yup.InferType<typeof detailOrderSchema>

const columnProductItems: TableColumns<OrderDetailProduct>[] = [
  {
    id: 'reference',
    label: 'Reference',
    cell: (value) => <CustomLink to={'#'}>{value?.toString()}</CustomLink>
  },

  { id: 'price', label: 'Unit price', numeric: true, cell: (value) => formatCurrency(Number(value)) },
  {
    id: 'quantity',
    label: 'Quantity',
    numeric: true,
    cell: (value) => Number(value)
  },
  { id: 'total', label: 'Total', numeric: true, cell: (value) => formatCurrency(Number(value)) }
]

export default function DetailOrder() {
  const param = useParams()
  const navigate = useNavigate()
  const { setHeaderData } = useHeaderTitleStore()
  const { tmpUndoData, setIsOpenUndo, setTmpUndoData, setTimerId } = useUndoOrderStore()

  const methods = useForm<FormValues>({
    resolver: yupResolver(detailOrderSchema),
    defaultValues: {
      status: '',
      returned: true
    }
  })

  const returned = useWatch({ name: 'returned', control: methods.control })
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
  const productIds = orderDetail.basket?.map((i) => i.product_id) || []

  const { mutate: deleteOrderMutation } = useMutation({
    mutationFn: (id: number[]) => deleteOrders(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order_list'] })
      setTimerId(null)
    }
  })

  const { mutate: updateOrderMutation } = useMutation({
    mutationFn: (orderDetail: UpdateOrderRequest) => updateOrder(orderDetail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order_list'] })
      setTimerId(null)
    }
  })

  const { data: customerDetailData } = useQuery({
    queryKey: ['customer_detail', orderDetail.customer_id],
    queryFn: () => fetchCustomerDetail({ id: Number(orderDetail.customer_id) }),
    refetchOnWindowFocus: false,
    enabled: !!param.id
  })
  const customerData = customerDetailData?.data

  const { data: productItemsData } = useQuery({
    queryKey: ['product_list', param.id, productIds],
    queryFn: () => fetchProductsList({ filter: { id: productIds }, pagination: { page: 1, perPage: 999 } }),
    enabled: !!productIds.length
  })
  const productItems = productItemsData?.data || []

  const getProductQuantityFromBasket = (productId: number): number => {
    if (!orderDetail?.basket?.length) return 0
    const productBasketItem = orderDetail.basket.find((i) => i.product_id === productId)
    return productBasketItem?.quantity || 0
  }

  const productItemsDataSource: OrderDetailProduct[] = useMemo(() => {
    return productItems.map((product) => {
      const quantity = getProductQuantityFromBasket(product.id)
      const total = quantity * Number(product.price)
      return {
        id: product.id,
        reference: product.reference,
        price: product.price,
        quantity,
        total
      }
    })
  }, [productItems, orderDetail.basket])

  const handleSubmit = () => {
    const payload = {
      id: Number(param.id),
      data: {
        ...orderDetail,
        returned,
        status: status as OrderStatus
      }
    }

    const newTmpData = tmpUndoData.filter((data) => data.id !== payload.id)
    setTmpUndoData(newTmpData)

    setIsOpenUndo(true)

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      updateOrderMutation(payload)
    }, 3000)

    setTimerId(timeOut)

    navigate(path.orders)
  }

  const handleDelete = () => {
    const cloneData = cloneDeep(tmpUndoData)
    const newTemporaryData = cloneData.filter((data) => data.id !== Number(param.id))

    setTmpUndoData(newTemporaryData)
    setIsOpenUndo(true)

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      deleteOrderMutation([Number(param.id)])
    }, 3000)

    setTimerId(timeOut)
    navigate(path.orders)
  }

  const handleSetHeaderDetail = () => {
    setHeaderData({
      title: `${customerData?.first_name} ${customerData?.last_name}`,
      avatar: customerData?.avatar
    })
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
                      label: ORDER_STATUS.ORDERED,
                      value: ORDER_STATUS.ORDERED
                    },
                    {
                      label: ORDER_STATUS.DELIVERED,
                      value: ORDER_STATUS.DELIVERED
                    },
                    {
                      label: ORDER_STATUS.CANCELLED,
                      value: ORDER_STATUS.CANCELLED
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

                <Box onClick={handleSetHeaderDetail}>
                  <CustomLink
                    to={`${path.customers}/${orderDetail.customer_id}`}
                  >{`${orderDetail?.customer.first_name} ${orderDetail?.customer.last_name}`}</CustomLink>
                </Box>
                <CustomLink to={`mailto:${orderDetail?.customer.email}`}>{orderDetail?.customer.email}</CustomLink>
                <Box sx={{ mt: 4 }}>
                  <Typography sx={{ mb: 1, fontWeight: 500, fontSize: '20px' }}>Shipping Address</Typography>
                  <Typography>{`${orderDetail?.customer.first_name} ${orderDetail?.customer.last_name}`}</Typography>
                  <Typography>
                    {orderDetail?.customer.address} {customerData?.stateAbbr} {customerData?.zipcode}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 20 }}>Items</Typography>
              <CustomTable<OrderDetailProduct, number>
                rowId='id'
                usePagination={false}
                selectable={false}
                columns={columnProductItems}
                dataSource={productItemsDataSource}
              />
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
            sx={[
              {
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
              },
              (theme) =>
                theme.applyStyles('dark', {
                  backgroundColor: '#424242'
                })
            ]}
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
