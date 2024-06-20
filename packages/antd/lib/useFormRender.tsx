import { Form } from 'antd'
import { FormItemBridgeWrapper, FormRenderProps, useDeps } from '@rf-render/antd'
import { RfRender } from '@rf-render/core'

export function useFormRender() {
  /**
   * @description form实例，使用useForm得到的
   */
  const [form] = Form.useForm()
  /**
   * @description 表单渲染组件，多了个schema属性其余和和antd的Form属性一致
   */
  function FormRender(props: FormRenderProps) {
    const { schema, immediateDeps = true, immediateValidate = false, ...antdFromProps } = props
    const { dependOnMaps } = useDeps(schema)
    const formName = Symbol('formName')
    const totalFieldsStatus = Object.keys(dependOnMaps.maps).reduce((acc: Record<string, boolean>, key) => {
      acc[key] = false
      return acc
    }, {})
    /**
     * 保证所有异步表单组件均加载完成后执行一次dependOn
     */
    const onComplete = (name: string) => {
      if (immediateDeps) {
        totalFieldsStatus[name] = true
        const isAllLazyComponentsLoaded = Object.values(totalFieldsStatus).every(v => v)
        const deps = RfRender.getAllDeps(formName) ?? []
        if (isAllLazyComponentsLoaded) {
          deps.forEach(async (dep) => {
            const { changeConfig, changeValue } = dep
            await changeValue(immediateValidate)
            await changeConfig()
          })
        }
      }
    }
    return (
      <Form
        form={form}
        {...antdFromProps}
      >
        {
          schema.map((item, index) => {
            return (
              <FormItemBridgeWrapper key={item.name || index} {...item} dependOnMaps={dependOnMaps} form={form} formName={formName} immediateDeps={immediateDeps} immediateValidate={immediateValidate} onComplete={onComplete} />
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
