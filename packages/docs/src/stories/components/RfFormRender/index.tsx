import { FormRenderProps, useFormRender } from '@rf-render/antd'
import { Button, Col, Row } from 'antd'

export default function RfFormRender(props: FormRenderProps) {
  const { FormRender, form } = useFormRender()
  return (
    <div style={{ width: '500px' }}>
      <FormRender {...props}>
      </FormRender>
      <Row gutter={24}>
        <Col>
          <Button type="primary" onClick={() => form.validateFields()}>validate</Button>
        </Col>
        <Col>
          <Button onClick={() => console.log(form.getFieldsValue())}>console formData</Button>
        </Col>
      </Row>

    </div>
  )
}
