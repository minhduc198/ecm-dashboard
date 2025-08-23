import TextFieldInput from '@/components/TextFieldInput'
import { getCustomerListParamsFormLS, saveCustomerListParamsToLS } from '@/utils/customers'
import { yupResolver } from '@hookform/resolvers/yup'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Box, IconButton, InputAdornment, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { hasNewsletterOptions, hasOrderedOptions, lastSeenGteOptions, segmentsOptions } from '../constant'
import { filterCustomerSchema } from '../schemas'
import { Groups } from '../types'
import SelectFilter from './SelectFilter'
import { useSearchParam } from '@/hooks/useSearchParam'
import { cleanObject } from '@/utils'

export default function FilterBarCustomer() {
  const customerParamFromLS = getCustomerListParamsFormLS()
  const { setMany } = useSearchParam()

  const method = useForm({
    resolver: yupResolver(filterCustomerSchema),
    defaultValues: {
      q: '',
      last_seen_gte: '',
      has_newsletter: '',
      nb_orders_gte: '',
      segment: ''
    }
  })
  const { isDirty } = method.formState
  const q = useWatch({ name: 'q', control: method.control })
  const last_seen_gte = useWatch({ name: 'last_seen_gte', control: method.control })
  const has_newsletter = useWatch({ name: 'has_newsletter', control: method.control })
  const nb_orders_gte = useWatch({ name: 'nb_orders_gte', control: method.control })
  const segment = useWatch({ name: 'segment', control: method.control })

  useEffect(() => {
    const customerFilterParamsFromLS = customerParamFromLS.filter
    if (customerParamFromLS) {
      method.reset({
        ...customerFilterParamsFromLS,
        segment: customerFilterParamsFromLS.groups
      })
    }
  }, [])

  useEffect(() => {
    if (!isDirty) {
      return
    }

    const filterParam = cleanObject({
      q,
      last_seen_gte,
      has_newsletter,
      nb_orders_gte,
      groups: segment
    })

    setMany({
      filter: JSON.stringify(filterParam),
      order: customerParamFromLS.order,
      page: JSON.stringify(customerParamFromLS.page + 1),
      perPage: JSON.stringify(customerParamFromLS.perPage),
      sort: customerParamFromLS.sort
    })

    saveCustomerListParamsToLS({
      ...customerParamFromLS,
      filter: {
        ...filterParam,
        groups: segment as Groups,
        has_newsletter
      }
    })
  }, [q, last_seen_gte, has_newsletter, nb_orders_gte, segment])

  return (
    <FormProvider {...method}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: '1px solid rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: 2
        }}
      >
        <TextFieldInput
          sxTextFieldInput={{ width: '100%' }}
          name='q'
          label='Search'
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon sx={{ width: '24px', height: '24px' }} />
                </InputAdornment>
              )
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookmarkBorderIcon sx={{ width: '24px', height: '24px' }} />
            <Typography sx={{ fontSize: '12px', letterSpacing: 2 }}>SAVED QUERIES</Typography>
          </Box>
          <IconButton>
            <AddCircleOutlineIcon color='action' />
          </IconButton>
        </Box>
        <SelectFilter
          name='last_seen_gte'
          filterLabel='LAST VISITED'
          IconFilter={<AccessTimeIcon color='action' />}
          options={lastSeenGteOptions}
        />

        <SelectFilter
          name='nb_orders_gte'
          filterLabel='HAS ORDERED'
          IconFilter={<MonetizationOnOutlinedIcon color='action' />}
          options={hasOrderedOptions}
        />

        <SelectFilter
          name='has_newsletter'
          filterLabel='HAS NEWSLETTER'
          IconFilter={<MailOutlineIcon color='action' />}
          options={hasNewsletterOptions}
        />

        <SelectFilter
          name='segment'
          filterLabel='SEGMENTS'
          IconFilter={<LocalOfferOutlinedIcon color='action' />}
          options={segmentsOptions}
        />
      </Box>
    </FormProvider>
  )
}
