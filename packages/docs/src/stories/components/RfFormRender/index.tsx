import { FormRenderProps, useFormRender } from '@rf-render/antd'
import { Button, Col, Row } from 'antd'

export default function RfFormRender(props: FormRenderProps) {
  const { FormRender, form, switchFileName } = useFormRender()
  return (
    <div style={{ width: '680px' }}>
      <FormRender {...props}>
      </FormRender>
      <Row gutter={24}>
        <Col>
          <Button type="primary" onClick={() => form.validateFields()}>表单校验</Button>
        </Col>
        <Col>
          <Button onClick={() => {
            const formData = form.getFieldsValue()
            console.log(formData)
          }}
          >
            打印表单值
          </Button>
        </Col>
        <Col>
          <Button onClick={() => {
            switchFileName('view')
          }}
          >
            切换为view文件
          </Button>
        </Col>
        <Col>
          <Button onClick={() => {
            switchFileName('index')
          }}
          >
            切换为index文件
          </Button>
        </Col>
      </Row>
    </div>
  )
}
