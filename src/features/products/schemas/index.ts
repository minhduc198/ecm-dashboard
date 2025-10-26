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
    .required('Image is required')
    .matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|ico))$/i, { message: 'Sai định dạng URL' }),
  thumbnail: yup
    .string()
    .required('Thumbnail is required')
    .matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|ico))$/i, { message: 'Sai định dạng URL' }),
  description: yup
    .string()
    .required('Description is required')
    .transform((value, originalValue) => (originalValue === '<p></p>' ? null : value)),
  price: yup
    .number()
    .required('Price is required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  stock: yup
    .number()
    .required('Stock is required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  sales: yup
    .number()
    .required('Sales is required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  width: yup
    .number()
    .required('Width is required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  height: yup
    .number()
    .required('Height is required')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  reference: yup.string().required('Reference is required'),
  category_id: yup
    .number()
    .required('Category is required')
    .transform((value, originalValue) => (originalValue === '' ? null : value))
})
