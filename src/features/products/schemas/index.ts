import * as yup from 'yup'

export const filterProductSchema = yup.object({
  q: yup.string(),
  sales: yup.object({
    sales_gt: yup.string(),
    sales_lte: yup.string(),
    sales: yup.string()
  }),
  stock: yup.object({
    stock: yup.string(),
    stock_lt: yup.string(),
    stock_gt: yup.string()
  }),
  category_id: yup.string()
})

export const productDetailSchema = yup.object({
  image: yup
    .string()
    .required('image_required')
    .matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|ico))$/i, { message: 'invalid_url_format' }),
  thumbnail: yup
    .string()
    .required('thumbnail_required')
    .matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|ico))$/i, { message: 'invalid_url_format' }),
  description: yup
    .string()
    .required('description_required')
    .transform((value, originalValue) => (originalValue === '<p></p>' ? null : value)),
  price: yup
    .number()
    .required('price_required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  stock: yup
    .number()
    .required('stock_required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  sales: yup
    .number()
    .required('sales_required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  width: yup
    .number()
    .required('width_required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  height: yup
    .number()
    .required('height_required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  reference: yup.string().required('reference_required'),
  category_id: yup
    .number()
    .required('category_required')
    .transform((value, originalValue) => (originalValue === '' ? null : value))
})
