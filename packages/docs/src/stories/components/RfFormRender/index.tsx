import { FormRenderProps, useFormRender } from '@rf-render/antd'
import { RfRender } from '@rf-render/core'
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
          <Button onClick={() => {
            const formData = form.getFieldsValue()
            console.log(formData)
          }}
          >
            console formData
          </Button>
        </Col>
        <Col>
          <Button onClick={() => {
            RfRender.switchFileName('view')
          }}
          >
            to view file
          </Button>
        </Col>
      </Row>
    </div>
  )
}
