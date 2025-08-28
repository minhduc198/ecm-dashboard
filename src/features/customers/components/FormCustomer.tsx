import CustomDatePicker from '@/components/CustomDatePicker'
import TextFieldAutoComplete from '@/components/TextFieldAutocomplete'
import TextFieldInput from '@/components/TextFieldInput'
import TextFieldSelect from '@/components/TextFieldSelect'
import { isoStringToDate } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Button, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { NEWSLETTER, segmentsOptions } from '../constant'
import { formCustomerSchema } from '../schemas'
import { Customer } from '@/services/data-generator'

interface Props {
  customerData?: Customer
  hasStats?: boolean
  size?: number
}

export default function FormCustomer({ customerData, hasStats, size }: Props) {
  const [displayPassword, setDisplayPassword] = useState(false)
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false)

  const methods = useForm({
    resolver: yupResolver(formCustomerSchema),
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
    formState: { isDirty }
  } = methods

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
    return
  }, [])

  const handleHiddenPassword = () => {
    setDisplayPassword(!displayPassword)
  }

  const handleHiddenConfirmPassword = () => {
    setDisplayConfirmPassword(!displayConfirmPassword)
  }

  return (
    <Grid container direction={'column'} size={{ xs: size }}>
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
        <FormProvider {...methods}>
          <Grid size={{ xs: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>Identity</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextFieldInput name='first_name' label='First name' sxTextFieldInput={{ width: '100%', mt: -2 }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextFieldInput name='last_name' label='Last name' sxTextFieldInput={{ width: '100%', mt: -2 }} />
                </Grid>
              </Grid>
              <TextFieldInput name='email' label='email' sxTextFieldInput={{ width: '100%' }} />
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
        </FormProvider>
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
          // onClick={handleSubmit}
        >
          SAVE
        </Button>

        {hasStats && (
          <Button sx={{ borderRadius: 1 }} color='error' startIcon={<DeleteIcon />}>
            DELETE
          </Button>
        )}
      </Box>
    </Grid>
  )
}
