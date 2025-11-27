import TextFieldInput from '@/components/TextFieldInput'
import { AppContext } from '@/contexts/AppContext'
import { path } from '@/routers/path'
import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import * as React from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { NavLink } from 'react-router'
import { authLoginSchemas } from '../schemas'
import { authLogin } from '../services'
import { LoginRequest } from '../types'
import { FacebookIcon, GoogleIcon } from './CustomIcons'
import ForgotPassword from './ForgotPassword'

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
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px'
  })
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4)
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
    })
  }
}))

export default function Login() {
  const [open, setOpen] = React.useState(false)
  const { setIsAuthenticated } = React.useContext(AppContext)

  const methods = useForm({
    resolver: yupResolver(authLoginSchemas),
    defaultValues: {
      studentId: '',
      password: ''
    }
  })
  const studentId = useWatch({ name: 'studentId', control: methods.control })
  const password = useWatch({ name: 'password', control: methods.control })

  const { handleSubmit } = methods

  const { mutate: login } = useMutation({
    mutationFn: (payload: LoginRequest) => authLogin(payload),
    onSuccess: (data) => {
      setIsAuthenticated(true)
      localStorage.setItem('access_token', data.access_token)
    }
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleLogin = () => {
    login({
      username: studentId,
      password
    })
  }

  return (
    <FormProvider {...methods}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction='column' justifyContent='space-between'>
        <Card variant='outlined'>
          <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Log in
          </Typography>
          <Box
            method='post'
            component='form'
            onSubmit={handleSubmit(handleLogin)}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2
            }}
          >
            <FormControl>
              <FormLabel htmlFor='studentId'>Student ID</FormLabel>
              <TextFieldInput
                label=''
                name='studentId'
                placeholder='Ex: 23bi14099'
                required
                variant='outlined'
                sxTextFieldInput={{
                  width: '100%',
                  '& .css-1tu6adf-MuiInputBase-input-MuiOutlinedInput-input': { height: '40px' }
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <TextFieldInput
                label=''
                name='password'
                placeholder='••••••'
                type='password'
                required
                variant='outlined'
                sxTextFieldInput={{
                  width: '100%',
                  '& .css-1tu6adf-MuiInputBase-input-MuiOutlinedInput-input': { height: '40px' }
                }}
              />
            </FormControl>

            <ForgotPassword open={open} handleClose={handleClose} />
            <Button type='submit' fullWidth variant='contained'>
              Sign in
            </Button>
            <Link
              component='button'
              type='button'
              onClick={handleClickOpen}
              variant='body2'
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <NavLink to={path.register} style={{ color: '#1976d2' }}>
                Register
              </NavLink>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </FormProvider>
  )
}
