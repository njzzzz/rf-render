import { Form } from 'antd'
import { FormRenderProps } from '@rf-render/react'
import { FormItemBridgeWrapper } from './FormItemBridgeWrapper'
import { useDeps } from './useDeps'

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
