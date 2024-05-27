import { FormRenderProps, useFormRender } from '@rf-render/antd'
import { Button } from 'antd'

export default function RfFormRender(props: FormRenderProps) {
  const { FormRender, form } = useFormRender()
  return (
    <div style={{ width: '500px' }}>
      <FormRender {...props}>
      </FormRender>
      <Button onClick={() => {
        console.log(form.getFieldsValue())
      }}
      >
        表单数据
      </Button>
    </div>
  )
}
