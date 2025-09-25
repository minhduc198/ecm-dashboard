import TextFieldInput from '@/components/TextFieldInput'
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import SearchIcon from '@mui/icons-material/Search'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import { Box, InputAdornment, Typography } from '@mui/material'

import SelectFilter from '@/features/customers/components/SelectFilter'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, Resolver, useForm, useWatch } from 'react-hook-form'
import { InferType } from 'yup'
import { categoryOptions, salesOptions, stockOptions } from '../constant'
import { filterProductSchema } from '../schemas'

type FormValues = InferType<typeof filterProductSchema>

export default function FilterBarProduct() {
  const method = useForm<FormValues>({
    resolver: yupResolver(filterProductSchema) as Resolver<FormValues>,
    defaultValues: {
      q: '',
      sales: '',
      categories: '',
      stock: ''
    }
  })

  const q = useWatch({ name: 'q', control: method.control })
  const sales = useWatch({ name: 'sales', control: method.control })
  const categories = useWatch({ name: 'categories', control: method.control })
  const stock = useWatch({ name: 'stock', control: method.control })

  const hasParams = !!q || !!sales || !!categories || !!stock

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
          {/* {hasParams ? (
            isEqual(currentQuery?.value, customerListRq) ? (
              <IconButton onClick={removeSaveQuery}>{<RemoveCircleOutlineIcon color='action' />}</IconButton>
            ) : (
              <IconButton onClick={handleClickOpen}>{<AddCircleOutlineIcon color='action' />}</IconButton>
            )
          ) : (
            <IconButton>{<HelpOutlineIcon color='action' />}</IconButton>
          )} */}
        </Box>
        {/* <Box sx={{ display: 'flex', flexDirection: 'column', mt: -2 }}>
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
        </Box> */}
        <SelectFilter
          name='sales'
          filterLabel='SALES'
          IconFilter={<AttachMoneySharpIcon color='action' />}
          options={salesOptions}
        />

        <SelectFilter
          name='stock'
          filterLabel='STOCK'
          IconFilter={<BarChartOutlinedIcon color='action' />}
          options={stockOptions}
        />

        <SelectFilter
          name='categories'
          filterLabel='CATEGORIES'
          IconFilter={<SellOutlinedIcon color='action' />}
          options={categoryOptions}
        />
      </Box>
      {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
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
      </Dialog> */}

      {/* <Dialog open={openRemoveDialog} onClose={handleCloseRemoveDialog}>
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
      </Dialog> */}
    </FormProvider>
  )
}
