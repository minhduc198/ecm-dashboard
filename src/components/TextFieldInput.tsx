import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, SxProps, TextField } from '@mui/material'
import type { TextFieldProps, TextFieldVariants } from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends Omit<TextFieldProps, 'variant'> {
  name: string
  label: string
  variant?: TextFieldVariants
  sxTextFieldInput?: SxProps
}

export default function TextFieldInput({ name, label, sxTextFieldInput, ...rest }: Props) {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
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
              borderBottom: '2px solid #4F3CC9'
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#4F3CC9'
            },
            ...sxTextFieldInput
          }}
          size='small'
          id={name}
          label={label}
          variant='filled'
          {...rest}
        />
      )}
    />
  )
}
