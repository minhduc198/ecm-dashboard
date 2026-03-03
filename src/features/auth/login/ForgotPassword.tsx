import TextFieldInput from '@/components/TextFieldInput'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useMutation } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { authForgotPasswordSchemas } from '../schemas'
import { forgotPassword } from '../services'
import { ForgotPasswordRequest } from '../types'

interface ForgotPasswordProps {
  open: boolean
  handleClose: () => void
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const methods = useForm({
    resolver: yupResolver(authForgotPasswordSchemas),
    defaultValues: {
      email: ''
    }
  })
  const email = useWatch({ name: 'email', control: methods.control })

  const { handleSubmit } = methods

  const { mutate: forgotPasswordMutation, isPending } = useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => forgotPassword(payload),
    onSuccess: () => {
      enqueueSnackbar('Send to email successful!', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      })

      handleClose()
    }
  })

  const handleForgotPassword = () => {
    methods.reset({ email: '' })
    forgotPasswordMutation({ email })
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleForgotPassword)} noValidate>
          <DialogTitle>Reset password</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <DialogContentText>
              Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
            </DialogContentText>
            <TextFieldInput
              label=''
              name='email'
              placeholder='Email address'
              required
              variant='outlined'
              sxTextFieldInput={{
                width: '100%',
                '& .css-1tu6adf-MuiInputBase-input-MuiOutlinedInput-input': { height: '40px' }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant='contained' type='submit' disabled={isPending}>
              Send
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  )
}
