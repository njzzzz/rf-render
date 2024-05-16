import { Form } from 'antd'
import { FormItemBridgeWrapper, FormRenderProps, useDeps } from '@rf-render/antd'

export function useFormRender() {
  const [form] = Form.useForm()
  const FormRender = (props: FormRenderProps) => {
    const { schema, ...antdFromProps } = props
    const { initializeRefs, depsExec } = useDeps(schema, form)
    return (
      <Form form={form} {...antdFromProps}>
        {
          schema.map((item) => {
            return (
              <FormItemBridgeWrapper key={item.name} {...item} ref={initializeRefs(item.name)} depsExec={depsExec} form={form} />
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
