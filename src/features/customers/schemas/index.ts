import * as yup from 'yup'

export const formCustomerSchema = yup.object({
  first_name: yup
    .string()
    .trim()
    .required('Require')
    .matches(/^(?!.*\s{2,})[\p{L}]+(?:[ '-][\p{L}]+)*$/u, { message: 'Invalid first name' }),
  last_name: yup
    .string()
    .trim()
    .required('Require')
    .matches(/^(?!.*\s{2,})[\p{L}]+(?:[ '-][\p{L}]+)*$/u, { message: 'Invalid last name' }),
  email: yup
    .string()
    .trim()
    .required('Require')
    .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, { message: 'Invalid email' }),
  birthday: yup.date().nullable().optional().max(new Date(), 'Incorrect birthday'),
  segments: yup.array().of(yup.string().defined()).nullable(),
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
  last_seen: yup.object({
    last_seen_gte: yup.string(),
    last_seen_lte: yup.string()
  }),
  has_newsletter: yup.string(),
  nb_orders_gte: yup.string(),
  groups: yup.string()
})
