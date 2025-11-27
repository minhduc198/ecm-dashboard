import * as yup from 'yup'
export const authLoginSchemas = yup.object({
  studentId: yup
    .string()
    .required('Required student ID')
    .matches(/^[A-Za-z0-9]+$/, 'Cannot contain special characters.'),
  password: yup.string().required('Required password').min(6, 'Password must be at least 6 characters')
})

export const authForgotPasswordSchemas = yup.object({
  email: yup.string().email('invalid email').required('Required email')
})

export const authRegisterSchemas = yup.object({
  email: yup.string().email('invalid email').required('Required email'),
  studentId: yup
    .string()
    .required('Required student ID')
    .matches(/^[A-Za-z0-9]+$/, 'Cannot contain special characters.'),
  password: yup.string().required('Required password').min(6, 'Password must be at least 6 characters'),
  userName: yup.string().required('Required user name')
})

export const resetPasswordSchema = yup.object({
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password')
})
