import SearchIcon from '@mui/icons-material/Search'
import { Box, InputAdornment, SxProps, TextField, Typography } from '@mui/material'
import type { TextFieldProps, TextFieldVariants } from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends Omit<TextFieldProps, 'variant'> {
  name: string
  label: string
  variant?: TextFieldVariants
  sxTextFieldInput?: SxProps
}

export default function TextFieldInput({ name, label, sxTextFieldInput, ...rest }: Props) {
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
            {...rest}
            helperText={errors[name]?.message as string}
          />
        )
      }}
    />
  )
}
