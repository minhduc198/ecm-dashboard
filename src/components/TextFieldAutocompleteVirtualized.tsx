import { SelectOptionItem } from '@/types'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import {
  Autocomplete,
  Box,
  BoxProps,
  IconButton,
  SxProps,
  TextField,
  Typography,
  ListSubheader,
  Popper,
  autocompleteClasses,
  styled
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { FixedSizeList } from 'react-window'
import InfiniteScroll from 'react-infinite-scroll-component'
import { forwardRef, HTMLAttributes, ReactElement, useEffect, useState } from 'react'

const LISTBOX_PADDING = 8

const ListboxComponent = styled('div')(
  () => `
  box-sizing: border-box;
`
)

interface CustomListboxProps {
  children?: React.ReactNode
  hasNextPage: boolean
  loadMore: () => void
  isLoading: boolean
}

const VirtualizedListbox = forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement> & CustomListboxProps>(
  function VirtualizedListbox(props, ref) {
    const { children, hasNextPage, loadMore, isLoading, ...other } = props
    const itemData: ReactElement[] = []

    if (Array.isArray(children)) {
      children.forEach((item) => {
        if (item && typeof item === 'object' && 'type' in item) {
          itemData.push(item as ReactElement)
        }
      })
    } else if (children && typeof children === 'object' && 'type' in children) {
      itemData.push(children as ReactElement)
    }

    const itemCount = itemData.length
    const itemSize = 48

    const renderItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
      return <div style={style}>{itemData[index]}</div>
    }

    const outerElementType = forwardRef<HTMLDivElement>((props: any, ref) => (
      <div
        ref={ref}
        {...props}
        style={{ ...props.style, paddingTop: LISTBOX_PADDING, paddingBottom: LISTBOX_PADDING }}
      />
    ))

    return (
      <div ref={ref}>
        <ListboxComponent {...other}>
          <div id='scrollable-list' style={{ maxHeight: '200px', overflow: 'auto' }}>
            <InfiniteScroll
              dataLength={itemCount}
              next={loadMore}
              hasMore={hasNextPage}
              loader={
                <ListSubheader component='div' style={{ textAlign: 'center', padding: '8px' }}>
                  {isLoading ? 'Loading...' : ''}
                </ListSubheader>
              }
              scrollableTarget='scrollable-list'
              style={{ overflow: 'visible' }}
            >
              <FixedSizeList
                itemData={itemData}
                height={Math.min(8 * itemSize, itemCount * itemSize) + 2 * LISTBOX_PADDING}
                width='100%'
                outerElementType={outerElementType}
                innerElementType='ul'
                itemSize={itemSize}
                overscanCount={5}
                itemCount={itemCount}
              >
                {renderItem}
              </FixedSizeList>
            </InfiniteScroll>
          </div>
        </ListboxComponent>
      </div>
    )
  }
)

interface Props {
  label: string
  name: string
  options: SelectOptionItem[]
  wrapperProps?: BoxProps
  sxAutocomplete?: SxProps
  multiple?: boolean
  handleClose?: () => void
  onSearch?: (searchTerm: string) => void
  hasNextPage?: boolean
  loadMore?: () => void
  isLoading?: boolean
}

export default function TextFieldAutocompleteVirtualized({
  name,
  label,
  options,
  multiple,
  wrapperProps,
  sxAutocomplete,
  handleClose,
  onSearch,
  hasNextPage = false,
  loadMore = () => {},
  isLoading = false
}: Props) {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(inputValue)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [inputValue, onSearch])

  return (
    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }} {...wrapperProps}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const { onChange, value, ref } = field
          const fieldValue = multiple
            ? options.filter((opt) => field.value?.includes(opt.value)) || []
            : options.find((opt) => opt.value === value) || null

          return (
            <Autocomplete
              multiple={multiple}
              value={fieldValue}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue)
              }}
              onChange={(_, newValue) => {
                const val = multiple
                  ? (newValue as SelectOptionItem[])?.map((opt) => opt.value)
                  : (newValue as SelectOptionItem)?.value || ''
                onChange(val)
              }}
              options={options}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, val) => option.value === val?.value}
              filterOptions={(options) => options}
              ListboxComponent={
                onSearch
                  ? (props) => (
                      <VirtualizedListbox
                        {...props}
                        hasNextPage={hasNextPage}
                        loadMore={loadMore}
                        isLoading={isLoading}
                      />
                    )
                  : undefined
              }
              PopperComponent={(props) => (
                <Popper
                  {...props}
                  style={{ ...props.style, width: 'fit-content', minWidth: props.style?.width }}
                  placement='bottom-start'
                />
              )}
              sx={{
                ...sxAutocomplete,
                [`& .${autocompleteClasses.listbox}`]: {
                  boxSizing: 'border-box',
                  '& ul': {
                    padding: 0,
                    margin: 0
                  }
                },
                '& .MuiFilledInput-root:after': {
                  borderBottom: '2px solid #4F3CC9'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#4F3CC9'
                },
                '& .MuiFilledInput-root': {
                  borderTopRightRadius: '10px',
                  borderTopLeftRadius: '10px',
                  paddingRight: '8px'
                }
              }}
              id={name}
              size='small'
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='filled'
                  label={label}
                  error={!!errors[name]}
                  helperText={(errors[name]?.message as string) || ''}
                  inputRef={ref}
                />
              )}
            />
          )
        }}
      />
      {handleClose && (
        <IconButton onClick={handleClose} aria-label='delete'>
          <RemoveCircleOutlineIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} />
        </IconButton>
      )}
    </Box>
  )
}
