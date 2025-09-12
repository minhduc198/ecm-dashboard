import * as yup from 'yup'

export const schema = yup.object().shape(
  {
    customer_id: yup.number().required('Vui lòng chọn người dùng'),
    total_gte: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .min(0, 'Số tiền tối thiểu phải lớn hơn hoặc bằng 0'),
    returned: yup.string(),
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
    q: yup.string()
  },
  [['date_lte', 'date_gte']]
)

export const detailOrderSchema = yup.object({
  returned: yup.boolean().default(false),
  status: yup.string().default('')
})
