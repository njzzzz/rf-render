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
    const { schema, immediateDeps = true, ...antdFromProps } = props
    const { dependOnMaps } = useDeps(schema)
    const formName = Symbol('formName')
    return (
      <Form
        form={form}
        {...antdFromProps}
      >
        {
          schema.map((item, index) => {
            return (
              <FormItemBridgeWrapper key={item.name || index} {...item} dependOnMaps={dependOnMaps} form={form} formName={formName} immediateDeps={immediateDeps} />
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
