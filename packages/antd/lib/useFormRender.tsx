import { Form } from 'antd'
import { FormItemBridgeWrapper, FormRenderProps, useDeps } from '@rf-render/antd'

export function useFormRender() {
  const [form] = Form.useForm()
  const FormRender = (props: FormRenderProps) => {
    const { schema, ...antdFromProps } = props
    const { depsExec, rtSchema } = useDeps(schema, form)
    return (
      <Form form={form} {...antdFromProps}>
        {
          rtSchema.map((item) => {
            return (
              <FormItemBridgeWrapper key={item.name} {...item} depsExec={depsExec} form={form} />
            )
          })
        }
      </Form>
    )
  }
  return {
    FormRender,
    form,
  }
}
