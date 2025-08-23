import * as yup from 'yup'

export const formCustomerSchema = yup.object({
  first_name: yup
    .string()
    .required('Require')
    .matches(/^(?!.*\s{2,})[\p{L}]+(?:[ '-][\p{L}]+)*$/u, { message: 'Invalid first name' }),
  last_name: yup
    .string()
    .required('Require')
    .matches(/^(?!.*\s{2,})[\p{L}]+(?:[ '-][\p{L}]+)*$/u, { message: 'Invalid last name' }),
  email: yup
    .string()
    .required('Require')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, { message: 'Invalid email' }),
  birthday: yup.date().nullable().optional(),
  segments: yup.array().of(yup.string()).nullable(),
  news_letter: yup.string().nullable(),
  address: yup.string(),
  city: yup.string(),
  state: yup.string(),
  zip_code: yup.string(),
  password: yup.string(),
  confirm_password: yup.string()
})

export const filterCustomerSchema = yup.object({
  q: yup.string(),
  last_seen_gte: yup.string(),
  has_newsletter: yup.string(),
  nb_orders_gte: yup.string(),
  segment: yup.string()
})
