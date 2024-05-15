import { RfRender } from '@rf-render/core'
import { CanModifyConfig, IRfRenderItem } from '@rf-render/react'
import { Form, FormInstance } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'

export interface FormItemBridgeWrapperHandle {
  update: (config: CanModifyConfig) => void
}
export const FormItemBridgeWrapper = forwardRef((item: IRfRenderItem & { depsExec: (key: string) => void, form: FormInstance }, ref) => {
  const [config, setConfig] = useState(item)
  const { name, ItemProps, widget = RfRender.defaultWidget, props, label, mapKeys = [] } = config
  const handler: FormItemBridgeWrapperHandle = {
    update: (c) => {
      setConfig({ ...config, ...c })
    },
  }
  useImperativeHandle(ref, () => handler)
  const overrideProps = {
    ...props,
    onChange(val: unknown) {
      config.form.setFieldValue(name, val)
      config.depsExec(name)
    },
    // 自定义组件需要抛出这个，结果为对象格式
    onMapKeysChange(valueMap: Record<string, unknown>) {
      mapKeys.forEach((key: string) => {
        config.form.setFieldValue(key, valueMap[key])
        config.depsExec(key)
      })
    },
  }
  return (
    <Form.Item key={name} name={name} label={label} {...(ItemProps ?? {})}>
      {/* 加载组件，并传入属性 */}
      {RfRender.load(widget)(overrideProps ?? {})}
    </Form.Item>
  )
})
