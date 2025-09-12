import { queryClient } from '@/App'
import CustomDatePicker from '@/components/CustomDatePicker'
import TextFieldAutoComplete from '@/components/TextFieldAutocomplete'
import TextFieldInput from '@/components/TextFieldInput'
import TextFieldSelect from '@/components/TextFieldSelect'
import { path } from '@/routers/path'
import { Customer } from '@/services/data-generator'
import { useUndoCustomerStore } from '@/store/undoCustomerStore'
import { isoStringToDate } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Button, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { InferType } from 'yup'
import { NEWSLETTER, segmentsOptions } from '../constant'
import { formCustomerSchema } from '../schemas'
import { createCustomer, deleteCustomers, updateCustomer } from '../service'
import { CreateCustomerRequest, UpdateCustomerRequest } from '../types'
import { useHeaderTitleStore } from '@/store/headerStore'

interface Props {
  customerData?: Customer
  hasStats?: boolean
  size?: number
}

type FormValues = InferType<typeof formCustomerSchema>

export default function FormCustomer({ customerData, hasStats, size }: Props) {
  const [displayPassword, setDisplayPassword] = useState(false)
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false)
  const { tmpUndoData, setIsOpenUndo, setTimerId, setAction, setTmpUndoData } = useUndoCustomerStore()
  const { setHeaderData } = useHeaderTitleStore()

  const navigate = useNavigate()

  const methods = useForm<FormValues>({
    resolver: yupResolver(formCustomerSchema) as Resolver<FormValues>,
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      news_letter: '',
      segments: [],
      birthday: null,
      address: '',
      city: '',
      zip_code: '',
      state: '',
      password: '',
      confirm_password: ''
    }
  })
  const {
    handleSubmit,
    formState: { isDirty }
  } = methods

  const first_name = useWatch({ name: 'first_name', control: methods.control })
  const last_name = useWatch({ name: 'last_name', control: methods.control })
  const email = useWatch({ name: 'email', control: methods.control })
  const news_letter = useWatch({ name: 'news_letter', control: methods.control })
  const segments = useWatch({ name: 'segments', control: methods.control })
  const birthday = useWatch({ name: 'birthday', control: methods.control })
  const address = useWatch({ name: 'address', control: methods.control })
  const city = useWatch({ name: 'city', control: methods.control })
  const zip_code = useWatch({ name: 'zip_code', control: methods.control })
  const state = useWatch({ name: 'state', control: methods.control })

  const { mutate: createCustomerMutation } = useMutation({
    mutationFn: (params: CreateCustomerRequest) => createCustomer(params),
    onSuccess: (data) => {
      navigate(`${path.customers}/${data.id}`)
      queryClient.invalidateQueries({ queryKey: ['customer_list'] })
    }
  })

  const { mutate: updateCustomerMutation } = useMutation({
    mutationFn: (params: UpdateCustomerRequest) => updateCustomer({ data: params.data, id: params.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_list'] })
      queryClient.invalidateQueries({ queryKey: ['customer_detail'] })
      setIsOpenUndo(false)
      setTimerId(null)
    }
  })

  const { mutate: deleteCustomerMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteCustomers({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_list'] })
      setIsOpenUndo(false)
    }
  })

  useEffect(() => {
    if (customerData) {
      methods.reset({
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: customerData.email,
        birthday: customerData.birthday ? isoStringToDate(customerData.birthday) : null,
        address: customerData.address ?? '',
        city: customerData.city ?? '',
        state: customerData.stateAbbr ?? '',
        zip_code: customerData.zipcode ?? '',
        segments: customerData.groups,
        news_letter: customerData.has_newsletter ? NEWSLETTER.Y : NEWSLETTER.N
      })
    }
  }, [customerData])

  const handleHiddenPassword = () => {
    setDisplayPassword(!displayPassword)
  }

  const handleHiddenConfirmPassword = () => {
    setDisplayConfirmPassword(!displayConfirmPassword)
  }

  const onSubmit = () => {
    const commonDetailCustomer = {
      first_name,
      last_name,
      email,
      address,
      city,
      zipcode: zip_code,
      stateAbbr: state,
      birthday: birthday?.toISOString()
    }

    if (!hasStats) {
      createCustomerMutation({
        data: commonDetailCustomer
      })
    } else {
      const newData = tmpUndoData.map((data) => {
        if (data.id === customerData?.id) {
          return {
            ...data,
            ...commonDetailCustomer
          }
        } else {
          return data
        }
      })

      setTmpUndoData(newData as Customer[])

      setIsOpenUndo(true)
      if (setAction) {
        setAction('Save Customer')
      }

      const updateTimerId = setTimeout(() => {
        if (customerData?.id) {
          updateCustomerMutation({
            id: customerData.id,
            data: {
              ...commonDetailCustomer,
              groups: segments?.length ? segments : [],
              has_newsletter: news_letter === 'true' ? true : false
            }
          })
        }
      }, 3000)

      setTimerId(updateTimerId)

      if (updateTimerId) {
        navigate(path.customers)
      }
    }
  }

  const handleDeleteCustomer = () => {
    const newData = cloneDeep(tmpUndoData).filter((data) => data.id !== customerData?.id)
    setTmpUndoData(newData)

    navigate(path.customers)

    setIsOpenUndo(true)
    if (setAction) {
      setAction('Delete Customer')
    }

    const deleteTimerId = setTimeout(() => {
      if (customerData?.id) {
        deleteCustomerMutation([customerData.id])
        setTimerId(null)
      }
    }, 3000)

    setTimerId(deleteTimerId)

    if (deleteTimerId) {
      navigate(path.customers)
    }
  }

  return (
    <Grid container direction={'column'} size={{ xs: size }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid
            container
            spacing={2}
            sx={{
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              paddingTop: 2,
              paddingRight: 2,
              paddingLeft: 2,
              paddingBottom: 5
            }}
          >
            <Grid size={{ xs: 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>Identity</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextFieldInput
                      name='first_name'
                      label='First name*'
                      sxTextFieldInput={{ width: '100%', mt: -2 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextFieldInput name='last_name' label='Last name*' sxTextFieldInput={{ width: '100%', mt: -2 }} />
                  </Grid>
                </Grid>
                <TextFieldInput name='email' label='Email*' sxTextFieldInput={{ width: '100%' }} />
                <CustomDatePicker name='birthday' datePickerLabel='Birthday' sxDatePicker={{ width: '196px' }} />

                <Typography sx={{ fontSize: '20px', fontWeight: 500, mt: -2 }}>Address</Typography>
                <TextFieldInput name='address' label='Address' sxTextFieldInput={{ width: '100%', mt: -2 }} />
                <Grid container spacing={1}>
                  <Grid size={{ xs: 5 }}>
                    <TextFieldInput name='city' label='City' sxTextFieldInput={{ width: '100%', mt: -3 }} />
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <TextFieldInput name='state' label='State' sxTextFieldInput={{ width: '100%', mt: -3 }} />
                  </Grid>
                  <Grid size={{ xs: 5 }}>
                    <TextFieldInput name='zip_code' label='Zipcode' sxTextFieldInput={{ width: '100%', mt: -3 }} />
                  </Grid>
                </Grid>

                <Typography sx={{ fontSize: '20px', fontWeight: 500, mt: -2 }}>Change Password</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextFieldInput
                      name='password'
                      label='Password'
                      sxTextFieldInput={{ width: '100%', mt: -2 }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleHiddenPassword}>
                                {displayPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                      type={`${displayPassword ? 'text' : 'password'}`}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextFieldInput
                      name='confirm_password'
                      label='Confirm password'
                      sxTextFieldInput={{ width: '100%', mt: -2 }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleHiddenConfirmPassword}>
                                {displayConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                      type={`${displayConfirmPassword ? 'text' : 'password'}`}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {hasStats && (
              <Grid size={{ xs: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>Stats</Typography>
                  <TextFieldAutoComplete
                    multiple
                    name='segments'
                    label='Segments'
                    options={segmentsOptions}
                    sxAutocomplete={{ width: '100%', mt: -2 }}
                  />
                  <TextFieldSelect
                    sxTextFiled={{ width: '100%' }}
                    name='news_letter'
                    textFieldLabel='Has newsletter'
                    options={[
                      {
                        label: 'Yes',
                        value: NEWSLETTER.Y
                      },
                      { label: 'No', value: NEWSLETTER.N }
                    ]}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              mt: -2,
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
              startIcon={<SaveIcon />}
            >
              SAVE
            </Button>

            {hasStats && (
              <Button onClick={handleDeleteCustomer} sx={{ borderRadius: 1 }} color='error' startIcon={<DeleteIcon />}>
                DELETE
              </Button>
            )}
          </Box>
        </form>
      </FormProvider>
    </Grid>
  )
}
