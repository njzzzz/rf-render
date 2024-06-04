import { Form } from 'antd'
import { FormItemBridgeWrapper, FormRenderProps, useDeps } from '@rf-render/antd'
import { RfRender } from '@rf-render/core'
import { useEffect } from 'react'

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
    const { dependOnMaps } = useDeps(schema)
    const formName = Symbol('formName')
    useEffect(() => {
      const deps = RfRender.getAllDeps(formName) ?? []
      deps.forEach(async (dep) => {
        const { changeConfig, changeValue } = dep
        changeValue && await dep.changeValue()
        changeConfig && await dep.changeConfig()
      })
    }, [])
    return (
      <Form form={form} {...antdFromProps}>
        {
          schema.map((item, index) => {
            return (
              <FormItemBridgeWrapper key={item.name || index} {...item} dependOnMaps={dependOnMaps} form={form} formName={formName} />
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
