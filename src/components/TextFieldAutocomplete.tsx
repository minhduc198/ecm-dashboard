import { SelectOptionItem } from '@/types'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Autocomplete, Box, BoxProps, IconButton, SxProps, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  label: string
  name: string
  options: SelectOptionItem[]
  wrapperProps?: BoxProps
  sxAutocomplete?: SxProps
  multiple?: boolean
  handleClose?: () => void
}

export default function TextFieldAutoComplete({
  name,
  label,
  options,
  multiple,
  wrapperProps,
  sxAutocomplete,
  handleClose
}: Props) {
  const {
    control,
    formState: { errors }
  } = useFormContext()

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
              onChange={(_, newValue) => {
                const val = multiple
                  ? (newValue as SelectOptionItem[])?.map((opt) => opt.value)
                  : (newValue as SelectOptionItem)?.value || ''
                onChange(val)
              }}
              options={options}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, val) => option.value === val?.value}
              sx={{
                ...sxAutocomplete,
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
          <RemoveCircleOutlineIcon
            sx={[
              { color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' },
              (theme) =>
                theme.applyStyles('dark', {
                  color: 'white'
                })
            ]}
          />
        </IconButton>
      )}
    </Box>
  )
}
