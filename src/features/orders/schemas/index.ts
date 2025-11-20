import * as yup from 'yup'

export const schema = yup.object().shape(
  {
    customer_id: yup
      .number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
    total_gte: yup
      .number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .min(0, 'minAmountRule'),
    returned: yup.string(),
    date_gte: yup
      .date()
      .nullable()
      .when('date_lte', {
        is: (val: any) => !!val,
        then: (schema) => schema.max(yup.ref('date_lte'), 'startDateRule')
      }),
    date_lte: yup
      .date()
      .nullable()
      .when('date_gte', {
        is: (val: any) => !!val,
        then: (schema) => schema.min(yup.ref('date_gte'), 'endDateRule')
      }),
    q: yup.string()
  },
  [['date_lte', 'date_gte']]
)

export const detailOrderSchema = yup.object({
  returned: yup.boolean().default(false),
  status: yup.string().default('')
})
