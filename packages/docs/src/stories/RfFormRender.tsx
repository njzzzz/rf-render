import { FormRenderProps, useFormRender } from '@rf-render/antd'

export default function RfFormRender(props: FormRenderProps) {
  const { FormRender } = useFormRender()
  return (
    <div style={{ width: '500px' }}>
      <FormRender {...props}>
      </FormRender>
    </div>
  )
}
