import TextFieldInput from '@/components/TextFieldInput'
import { path } from '@/routers/path'
import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import Checkbox from '@mui/material/Checkbox'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router'
import { authRegisterSchemas } from '../schemas'
import { authRegister } from '../services'
import { RegisterRequest } from '../types'

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

export default function Register() {
  const navigate = useNavigate()

  const methods = useForm({
    resolver: yupResolver(authRegisterSchemas),
    defaultValues: {
      studentId: '',
      userName: '',
      email: '',
      password: ''
    }
  })
  const studentId = useWatch({ name: 'studentId', control: methods.control })
  const password = useWatch({ name: 'password', control: methods.control })
  const userName = useWatch({ name: 'userName', control: methods.control })
  const email = useWatch({ name: 'email', control: methods.control })

  const { handleSubmit } = methods

  const { mutate: registerUser } = useMutation({
    mutationFn: (payload: RegisterRequest) => authRegister(payload),
    onSuccess: () => {
      enqueueSnackbar('Create account successfully!', {
        variant: 'success',
        autoHideDuration: 1000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      })
      navigate(path.login)
    }
  })

  const onSubmit = () => {
    registerUser({
      fullname: userName,
      username: studentId,
      email,
      password
    })
  }

  return (
    <FormProvider {...methods}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction='column' justifyContent='center'>
        <Card variant='outlined'>
          <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Register
          </Typography>

          <Box
            component='form'
            method='post'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
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
              <FormLabel htmlFor='username'>Username</FormLabel>
              <TextFieldInput
                label=''
                name='userName'
                placeholder='John Doe'
                required
                variant='outlined'
                sxTextFieldInput={{
                  width: '100%',
                  '& .css-1tu6adf-MuiInputBase-input-MuiOutlinedInput-input': { height: '40px' }
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <TextFieldInput
                label=''
                name='email'
                placeholder='example@gmail.com'
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

            <FormControlLabel control={<Checkbox color='primary' />} label='I agree to terms & policies' />

            <Button type='submit' fullWidth variant='contained'>
              Sign up
            </Button>

            <Divider>or</Divider>

            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?
              <NavLink to={path.login} style={{ color: '#1976d2' }}>
                Login
              </NavLink>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </FormProvider>
  )
}
