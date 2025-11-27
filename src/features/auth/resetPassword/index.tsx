import TextFieldInput from '@/components/TextFieldInput'
import { path } from '@/routers/path'
import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import CssBaseline from '@mui/material/CssBaseline'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { resetPasswordSchema } from '../schemas'
import { resetPassword } from '../services'
import { ResetPasswordRequest } from '../types'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px'
  }
}))

const ForgotContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4)
  }
}))

export default function ResetPassword() {
  const params = useParams()
  const navigate = useNavigate()

  const methods = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })
  const password = useWatch({ name: 'password', control: methods.control })

  const { handleSubmit } = methods

  const { mutate: resetPasswordMutation } = useMutation({
    mutationFn: (payload: ResetPasswordRequest) => resetPassword(payload),
    onSuccess: () => {
      enqueueSnackbar('Reset new password successful!', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      })
      navigate(path.login)
    }
  })

  const onSubmit = () => {
    resetPasswordMutation({
      new_password: password,
      token: params.token ?? ''
    })
  }

  return (
    <FormProvider {...methods}>
      <CssBaseline enableColorScheme />
      <ForgotContainer direction='column' justifyContent='center'>
        <Card variant='outlined'>
          <Typography component='h1' variant='h4' sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Reset Password
          </Typography>

          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor='password'>New Password</FormLabel>
              <TextFieldInput
                label=''
                name='password'
                type='password'
                placeholder='••••••'
                required
                variant='outlined'
                sxTextFieldInput={{
                  width: '100%',
                  '& .css-1tu6adf-MuiInputBase-input-MuiOutlinedInput-input': { height: '40px' }
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='confirmPassword'>Confirm Password</FormLabel>
              <TextFieldInput
                label=''
                name='confirmPassword'
                type='password'
                placeholder='••••••'
                required
                variant='outlined'
                sxTextFieldInput={{
                  width: '100%',
                  '& .css-1tu6adf-MuiInputBase-input-MuiOutlinedInput-input': { height: '40px' }
                }}
              />
            </FormControl>

            <Button type='submit' fullWidth variant='contained'>
              Change Password
            </Button>
          </Box>
        </Card>
      </ForgotContainer>
    </FormProvider>
  )
}
