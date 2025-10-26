import * as yup from 'yup'

export const createReviewSchema = yup.object({
  customer_id: yup.number().required('Enter customer'),
  product_id: yup.number().required('Enter product'),
  date: yup.string().required('Enter date'),
  rating: yup.number(),
  comment: yup.string().required('Enter comment')
})

export const filterReviewSchema = yup.object().shape(
  {
    date_gte: yup
      .date()
      .nullable()
      .when('date_lte', {
        is: (val: any) => val != null,
        then: (schema) => schema.max(yup.ref('date_lte'), 'Ngày bắt đầu phải trước ngày kết thúc')
      }),
    date_lte: yup
      .date()
      .nullable()
      .when('date_gte', {
        is: (val: any) => val != null,
        then: (schema) => schema.min(yup.ref('date_gte'), 'Ngày kết thúc phải sau ngày bắt đầu')
      }),
    q: yup.string(),
    product_id: yup.string(),
    customer_id: yup.string(),
    status: yup.string()
  },
  [['date_gte', 'date_lte']]
)
