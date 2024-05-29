import { Form } from 'antd'
import { FormItemBridgeWrapper, FormRenderProps, useDeps } from '@rf-render/antd'

export function useFormRender() {
  /**
   * @description form实例，使用useForm得到的
   */
  const [form] = Form.useForm()
  /**
   * @description 表单渲染组件，多了个schema属性其余和和antd的Form属性一致
   */
  function FormRender(props: FormRenderProps) {
    const { schema, ...antdFromProps } = props
    const { depsExec, rtSchema } = useDeps(schema, form)
    return (
      <Form form={form} {...antdFromProps}>
        {
          rtSchema.map((item, index) => {
            return (
              <FormItemBridgeWrapper key={item.name || index} {...item} depsExec={depsExec} form={form} />
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
