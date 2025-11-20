import * as yup from 'yup'

export const createReviewSchema = yup.object({
  customer_id: yup.number().required('enter_customer'),
  product_id: yup.number().required('enter_product'),
  date: yup.string().required('enter_date'),
  rating: yup.number(),
  comment: yup.string().required('enter_comment')
})

export const filterReviewSchema = yup.object().shape(
  {
    date_gte: yup
      .date()
      .nullable()
      .when('date_lte', {
        is: (val: any) => val != null,
        then: (schema) => schema.max(yup.ref('date_lte'), 'start_date_before_end_date')
      }),
    date_lte: yup
      .date()
      .nullable()
      .when('date_gte', {
        is: (val: any) => val != null,
        then: (schema) => schema.min(yup.ref('date_gte'), 'end_date_after_start_date')
      }),
    q: yup.string(),
    product_id: yup.string(),
    customer_id: yup.string(),
    status: yup.string()
  },
  [['date_gte', 'date_lte']]
)

export const reviewDetailSchema = yup.object({
  comment: yup.string().required('enter_comment')
})
