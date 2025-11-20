import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { IconButton, SxProps, TextField } from '@mui/material'
import { Box, BoxProps } from '@mui/system'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  name: string
  triggerFiled?: string
  datePickerLabel: string
  sxDatePicker?: SxProps
  wrapperProps?: BoxProps
  isRequired?: boolean
  handleClose?: () => void
  triggerValidate?: () => void
}

export default function CustomDatePicker({
  name,
  datePickerLabel,
  sxDatePicker,
  wrapperProps,
  triggerFiled = '',
  isRequired = false,
  handleClose
}: Props) {
  const { t } = useTranslation('common')
  const {
    control,
    getValues,
    trigger,
    formState: { errors }
  } = useFormContext()
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '2px',
        alignItems: 'baseline',
        '& .MuiOutlinedInput-root': {
          borderRadius: '16px',
          backgroundColor: '#f5f5f5'
        },
        '& .MuiInputLabel-root': {
          color: '#555'
        },
        ...wrapperProps
      }}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <DatePicker
              {...field}
              value={field.value || null}
              label={datePickerLabel}
              format='dd/MM/yyyy'
              onChange={(v) => {
                field.onChange(v)
                if (triggerFiled && !!errors[triggerFiled]?.message) {
                  trigger(triggerFiled)
                }
              }}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  placeholder: 'dd/mm/yyyy',
                  fullWidth: true,
                  variant: 'filled',
                  size: 'small',
                  required: isRequired,
                  sx: {
                    '& .MuiFilledInput-root:after': {
                      color: errors[name]?.message ? 'red' : '#4F3CC9'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: errors[name]?.message ? 'red' : '#4F3CC9'
                    },
                    ...sxDatePicker,
                    '& .MuiFilledInput-root': {
                      borderTopRightRadius: '10px',
                      borderTopLeftRadius: '10px',
                      paddingRight: '16px'
                    }
                  },
                  error: !!errors[name],
                  helperText: t(errors[name]?.message as string) || ''
                }
              }}
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
