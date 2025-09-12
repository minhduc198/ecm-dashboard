import TextFieldInput from '@/components/TextFieldInput'
import { DEFAULT_PAGE } from '@/constants'
import { useSearchParam } from '@/hooks/useSearchParam'
import { QuerySaveType } from '@/types'
import { cleanObject } from '@/utils'
import {
  getCustomerListParamsFormLS,
  getCustomerSaveQueries,
  saveCustomerListParamsToLS,
  saveQueriesCustomer
} from '@/utils/customers'
import { yupResolver } from '@hookform/resolvers/yup'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { debounce, isEqual } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, Resolver, useForm, useWatch } from 'react-hook-form'
import { InferType } from 'yup'
import {
  DEFAULT_PER_PAGE_CUSTOMER,
  hasNewsletterOptions,
  hasOrderedOptions,
  lastSeenGteOptions,
  segmentsOptions
} from '../constant'
import { filterCustomerSchema } from '../schemas'
import { CustomerUrlQuery, GetCustomersListRequest } from '../types'
import SelectFilter from './SelectFilter'

interface Props {
  setCustomerListRq: React.Dispatch<React.SetStateAction<GetCustomersListRequest>>
  customerListRq: GetCustomersListRequest
}

type FormValues = InferType<typeof filterCustomerSchema>

export default function FilterBarCustomer({ setCustomerListRq, customerListRq }: Props) {
  const customerParamFromLS = getCustomerListParamsFormLS()
  const { setMany, deleteMany, replaceParams, getAll } = useSearchParam()
  const [searchName, setSearchName] = useState(customerParamFromLS.filter.q)

  const [openDialog, setOpenDialog] = React.useState(false)
  const [openRemoveDialog, setOpenRemoveDialog] = React.useState(false)
  const [saveQueryName, setSaveQueryName] = React.useState('')
  const [idQuery, setIdQuery] = useState(0)

  const saveQueriesCustomerFromLS = getCustomerSaveQueries()

  const [saveQueries, setSaveQueries] = useState(saveQueriesCustomerFromLS ?? ([] as QuerySaveType[]))

  const method = useForm<FormValues>({
    resolver: yupResolver(filterCustomerSchema) as Resolver<FormValues>,
    defaultValues: {
      q: '',
      last_seen: { last_seen_gte: '', last_seen_lte: '' },
      has_newsletter: '',
      nb_orders_gte: '',
      groups: ''
    }
  })
  const { isDirty } = method.formState
  const q = useWatch({ name: 'q', control: method.control })
  const last_seen = useWatch({ name: 'last_seen', control: method.control })
  const has_newsletter = useWatch({ name: 'has_newsletter', control: method.control })
  const nb_orders_gte = useWatch({ name: 'nb_orders_gte', control: method.control })
  const groups = useWatch({ name: 'groups', control: method.control })

  const onDebounceSearch = useMemo(() => debounce((value?: string) => setSearchName(value), 300), [])

  const hasParams =
    !!q || !!has_newsletter || !!nb_orders_gte || !!groups || !!last_seen.last_seen_gte || !!last_seen.last_seen_lte

  const currentQuery = saveQueries.find((query) => isEqual(query.value, customerListRq)) ?? ({} as QuerySaveType)

  useEffect(() => {
    const queryId = saveQueries.find((query) => isEqual(query.value, customerListRq)) ?? ({} as QuerySaveType)
    setIdQuery(queryId.id)
  }, [customerListRq])

  useEffect(() => {
    onDebounceSearch(q)
    return () => {
      onDebounceSearch.cancel()
    }
  }, [q, onDebounceSearch])

  useEffect(() => {
    const customerFilterParamsFromLS = customerParamFromLS.filter
    if (customerParamFromLS) {
      method.reset({
        ...customerFilterParamsFromLS,
        last_seen: {
          last_seen_gte: customerFilterParamsFromLS.last_seen_gte,
          last_seen_lte: customerFilterParamsFromLS.last_seen_lte
        }
      })
    }
  }, [JSON.stringify(customerParamFromLS), customerListRq])

  useEffect(() => {
    saveQueriesCustomer(saveQueries)
  }, [saveQueries])

  useEffect(() => {
    if (!isDirty) {
      return
    }

    const obj = {
      q: searchName,
      has_newsletter,
      nb_orders_gte,
      groups,
      last_seen
    }

    const filterParam = cleanObject(obj)

    const newFilterParam = cleanObject({
      ...filterParam,
      last_seen: '',
      last_seen_gte: last_seen.last_seen_gte,
      last_seen_lte: last_seen.last_seen_lte
    })

    setMany({
      filter: JSON.stringify(newFilterParam),
      page: DEFAULT_PAGE.toString(),
      perPage: DEFAULT_PER_PAGE_CUSTOMER.toString(),
      order: customerParamFromLS.order,
      sort: customerParamFromLS.sort
    })

    saveCustomerListParamsToLS({
      ...customerParamFromLS,
      filter: newFilterParam,

      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE_CUSTOMER
    })

    setCustomerListRq({
      filter: newFilterParam,
      sort: {
        field: customerParamFromLS.sort,
        order: customerParamFromLS.order
      },
      pagination: {
        page: DEFAULT_PAGE + 1,
        perPage: DEFAULT_PER_PAGE_CUSTOMER
      }
    })
  }, [searchName, last_seen, has_newsletter, nb_orders_gte, groups])

  const handleSetSaveQueryName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setSaveQueryName(value)
  }

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSaveQueries = () => {
    setSaveQueries((prev) => [...prev, { name: saveQueryName, value: customerListRq, id: new Date().getTime() }])
    setOpenDialog(false)
    setSaveQueryName('')
  }

  const handleSelectQuery = (id: number) => {
    setIdQuery(id)
    const newQuery = saveQueries.find((query) => query.id === id)

    const querySaveToLS: CustomerUrlQuery = {
      filter: { ...newQuery?.value.filter },
      page: newQuery?.value.pagination.page - 1,
      perPage: newQuery?.value.pagination.perPage,
      order: newQuery?.value.sort.order,
      sort: newQuery?.value.sort.field
    }

    setCustomerListRq(newQuery?.value)
    saveCustomerListParamsToLS(querySaveToLS)
  }

  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false)
  }

  const handleConfirmRemoveDialog = () => {
    setOpenRemoveDialog(false)
    const newQuery = saveQueries.filter((query) => query.id !== idQuery)
    setSaveQueries(newQuery)
  }

  const removeSaveQuery = () => {
    setOpenRemoveDialog(true)
  }

  const handleRemoveAllParams = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    saveCustomerListParamsToLS({
      ...customerParamFromLS,
      filter: {}
    })

    setCustomerListRq({
      ...customerListRq,
      filter: {}
    })

    const searchParamKeys = Object.keys(getAll())
    deleteMany(searchParamKeys)
    replaceParams({
      filter: '{}'
    })
  }

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
          {hasParams ? (
            isEqual(currentQuery?.value, customerListRq) ? (
              <IconButton onClick={removeSaveQuery}>{<RemoveCircleOutlineIcon color='action' />}</IconButton>
            ) : (
              <IconButton onClick={handleClickOpen}>{<AddCircleOutlineIcon color='action' />}</IconButton>
            )
          ) : (
            <IconButton>{<HelpOutlineIcon color='action' />}</IconButton>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: -2 }}>
          {saveQueries.map((data) => (
            <Box
              onClick={() => handleSelectQuery(data.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '32px',
                paddingRight: '4px',
                paddingBlock: '4px',
                cursor: 'pointer',
                bgcolor: currentQuery?.id === data.id ? 'rgba(0,0,0,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: currentQuery?.id === data.id ? 'rgba(0,0,0,0.1)' : 'grey.100'
                },
                transition: '0.2s'
              }}
              key={data.id}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '14px' }}>{data.name}</Typography>
                {data.id === currentQuery.id && (
                  <IconButton sx={{ width: '24px', height: '24px' }} size='small' onClick={handleRemoveAllParams}>
                    <HighlightOffIcon color='action' />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
        </Box>
        <SelectFilter
          name='last_seen'
          defaultValue={{
            last_seen_gte: '',
            last_seen_lte: ''
          }}
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
          name='groups'
          filterLabel='SEGMENTS'
          IconFilter={<LocalOfferOutlinedIcon color='action' />}
          options={segmentsOptions}
        />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Save current query as</DialogTitle>

        <DialogContent>
          <TextField
            value={saveQueryName}
            onChange={handleSetSaveQueryName}
            label='Query name'
            type='search'
            variant='filled'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>CANCEL</Button>
          <Button onClick={handleSaveQueries} autoFocus>
            SAVE
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRemoveDialog} onClose={handleCloseRemoveDialog}>
        <DialogTitle>{'Remove saved query?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to remove that item from your list of saved queries?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveDialog}>CANCEL</Button>
          <Button onClick={handleConfirmRemoveDialog}>CONFIRM</Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  )
}
