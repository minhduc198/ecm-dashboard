import * as yup from 'yup'

export const formCustomerSchema = yup.object({
  first_name: yup
    .string()
    .trim()
    .required('require')
    .matches(/^(?!.*\s{2,})[\p{L}]+(?:[ '-][\p{L}]+)*$/u, { message: 'invalid_first_name' }),
  last_name: yup
    .string()
    .trim()
    .required('require')
    .matches(/^(?!.*\s{2,})[\p{L}]+(?:[ '-][\p{L}]+)*$/u, { message: 'invalid_last_name' }),
  email: yup
    .string()
    .trim()
    .required('require')
    .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, { message: 'invalid_email' }),
  birthday: yup.date().nullable().optional().max(new Date(), 'incorrect_birthday'),
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
