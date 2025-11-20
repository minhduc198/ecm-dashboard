import { fa } from '@faker-js/faker'
import SearchIcon from '@mui/icons-material/Search'
import { Box, InputAdornment, SxProps, TextField, Typography } from '@mui/material'
import type { TextFieldProps, TextFieldVariants } from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props extends Omit<TextFieldProps, 'variant'> {
  name: string
  label: string
  variant?: TextFieldVariants
  sxTextFieldInput?: SxProps
  isRequired?: boolean
  multiline?: boolean
}

export default function TextFieldInput({
  name,
  label,
  sxTextFieldInput,
  isRequired = false,
  multiline = false,
  ...rest
}: Props) {
  const { t } = useTranslation('common')
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            multiline={multiline}
            sx={{
              width: '236px',
              '& .MuiFilledInput-root': {
                borderTopRightRadius: '10px',
                borderTopLeftRadius: '10px',
                paddingRight: '8px'
              },
              '& .MuiFilledInput-root:after': {
                color: errors[name]?.message ? 'red' : '#4F3CC9'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: errors[name]?.message ? 'red' : '#4F3CC9'
              },
              ...sxTextFieldInput
            }}
            size='small'
            id={name}
            label={label}
            variant='filled'
            error={!!errors[name]?.message}
            required={isRequired}
            {...rest}
            helperText={t(errors[name]?.message as string)}
          />
        )
      }}
    />
  )
}
