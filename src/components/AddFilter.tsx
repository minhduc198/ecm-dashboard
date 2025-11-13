import { useSearchParam } from '@/hooks/useSearchParam'
import { FilterItem, QuerySaveType, UrlQuery } from '@/types'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  styled,
  TextField
} from '@mui/material'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { cloneDeep } from 'lodash'
import isEqual from 'lodash/isEqual'
import * as React from 'react'

interface Props<T> {
  queryObject: UrlQuery<T>
  filterItems: FilterItem<T>[]
  currentSaveQueries?: QuerySaveType[]
  handleAddFilterItem: (filterItems: FilterItem<T>[]) => void
  handleRemoveAllFilterItem: (filterItems: FilterItem<T>[]) => void
  handleAddSaveQuery: (currentSaveQueries: QuerySaveType[]) => void
  handleRemoveSaveQuery: (id: number) => void
  handleUseQueryFromLS: (param: UrlQuery<T>) => void
}

const CustomBox = styled('div')({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  paddingBlock: '6px',
  paddingInline: '16px',
  cursor: 'pointer',
  '&:hover': {
    bgcolor: 'rgba(0, 0, 0, 0.04)'
  }
})

export default function AddFilter<T>({
  queryObject,
  filterItems,
  currentSaveQueries = [],
  handleAddFilterItem,
  handleRemoveAllFilterItem,
  handleAddSaveQuery,
  handleRemoveSaveQuery,
  handleUseQueryFromLS
}: Props<T>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [openRemoveDialog, setOpenRemoveDialog] = React.useState(false)
  const [saveQueryName, setSaveQueryName] = React.useState('')
  const [removeId, setRemoveId] = React.useState(0)

  const open = Boolean(anchorEl)
  const isCurrentQuery = currentSaveQueries.some((data) => isEqual(data.value, queryObject))

  const { setMany } = useSearchParam()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCheckBox = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const cloneFilterItem = cloneDeep(filterItems)
    cloneFilterItem[idx].isChecked = e.target.checked
    const updateFilterItem: FilterItem<T>[] = [...cloneFilterItem]
    handleAddFilterItem(updateFilterItem)
  }

  const handleRemoveAll = () => {
    const newFilterItem = filterItems.map((item) => {
      return {
        ...item,
        isChecked: false
      }
    })

    handleRemoveAllFilterItem(newFilterItem)
    setAnchorEl(null)
  }

  const handleClickOpen = () => {
    setSaveQueryName('')
    setOpenDialog(true)
    setAnchorEl(null)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSave = () => {
    const newSaveQuery: QuerySaveType[] = [
      ...currentSaveQueries,
      {
        name: saveQueryName,
        value: queryObject,
        id: new Date().getTime()
      }
    ]
    handleAddSaveQuery(newSaveQuery)
    setOpenDialog(false)
    setSaveQueryName('')
  }

  const handleSetSaveQueryName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setSaveQueryName(value)
  }

  const handleOpenRemoveDialog = (id: number) => {
    setOpenRemoveDialog(true)
    setRemoveId(id)
    setAnchorEl(null)
  }

  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false)
  }

  const handleConfirmRemoveDialog = () => {
    handleRemoveSaveQuery(removeId)
    setOpenRemoveDialog(false)
  }

  const handleUseSaveQuery = (data: QuerySaveType) => {
    setMany({
      filter: JSON.stringify(data.value.filter),
      displayedFilters: JSON.stringify(data.value.displayedFilters)
    })
    handleUseQueryFromLS(data.value)
  }

  return (
    <div>
      <Button startIcon={<FilterListIcon />} variant='text' onClick={handleClick}>
        ADD FILTERS
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '10px'
            }
          }
        }}
      >
        <Box sx={{ paddingBlock: '8px', display: 'flex', flexDirection: 'column' }}>
          {filterItems?.map((item, idx) => (
            <FormControlLabel
              key={item.label}
              sx={[
                {
                  minWidth: '215px',
                  margin: 0,
                  paddingInline: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                },
                (theme) =>
                  theme.applyStyles('dark', {
                    '&:hover': {
                      backgroundColor: 'rgb(225, 225, 225, 0.1)'
                    }
                  })
              ]}
              control={
                <Checkbox
                  onChange={handleCheckBox(idx)}
                  checked={item.isChecked}
                  sx={[
                    {
                      mr: '16px',
                      width: '20px',
                      color: 'rgba(0, 0, 0, 0.54)',
                      '&.Mui-checked': {
                        color: 'rgba(0, 0, 0, 0.54)'
                      },
                      '&:hover': {
                        backgroundColor: 'transparent'
                      }
                    },
                    (theme) =>
                      theme.applyStyles('dark', {
                        color: 'white',
                        '&.Mui-checked': {
                          color: 'white'
                        }
                      })
                  ]}
                />
              }
              label={item.label}
            />
          ))}

          <Divider sx={{ mb: 1 }} />

          {currentSaveQueries.map((data) =>
            isEqual(data.value, queryObject) ? (
              <CustomBox key={data.id} onClick={() => handleOpenRemoveDialog(data.id)}>
                <BookmarkRemoveIcon
                  sx={[
                    { color: 'rgba(0, 0, 0, 0.54)', width: '20px' },
                    (theme) =>
                      theme.applyStyles('dark', {
                        color: 'white'
                      })
                  ]}
                />
                <Typography>{`Remove query "${data.name}"`}</Typography>
              </CustomBox>
            ) : (
              <CustomBox key={data.id} onClick={() => handleUseSaveQuery(data)}>
                <BookmarkBorderIcon
                  sx={[
                    { color: 'rgba(0, 0, 0, 0.54)', width: '20px' },
                    (theme) =>
                      theme.applyStyles('dark', {
                        color: 'white'
                      })
                  ]}
                />
                <Typography>{data.name}</Typography>
              </CustomBox>
            )
          )}

          {!isCurrentQuery && (
            <CustomBox onClick={handleClickOpen}>
              <BookmarkAddIcon
                sx={[
                  { color: 'rgba(0, 0, 0, 0.54)', width: '20px' },
                  (theme) =>
                    theme.applyStyles('dark', {
                      color: 'white'
                    })
                ]}
              />
              <Typography>Save current query</Typography>
            </CustomBox>
          )}

          <CustomBox onClick={handleRemoveAll}>
            <CloseIcon
              sx={[
                { color: 'rgba(0, 0, 0, 0.54)', width: '20px' },
                (theme) =>
                  theme.applyStyles('dark', {
                    color: 'white'
                  })
              ]}
            />
            <Typography>Remove all filters</Typography>
          </CustomBox>
        </Box>
      </Popover>

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
          <Button disabled={!saveQueryName} onClick={handleSave} autoFocus>
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
    </div>
  )
}
