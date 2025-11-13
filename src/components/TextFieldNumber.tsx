import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Box, BoxProps, IconButton, SxProps, TextField } from '@mui/material'

import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  label: string
  handleClose?: () => void
  wrapperProps?: BoxProps
  sxTextFiled: SxProps
  name: string
}

export default function TextFieldNumber({ label, handleClose, wrapperProps, sxTextFiled, name }: Props) {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'baseline' }} {...wrapperProps}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value || ''}
            sx={{
              ...sxTextFiled,
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
              }
            }}
            id='filled-number'
            label={label}
            size='small'
            type='number'
            variant='filled'
            error={!!errors[name]}
            helperText={(errors[name]?.message as string) || ''}
          />
        )}
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
