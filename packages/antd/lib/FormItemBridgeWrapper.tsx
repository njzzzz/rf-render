import { FormItemBridgeProps, RfRender } from '@rf-render/core'
import { DepsExec, IRfRenderItem } from '@rf-render/antd'
import { Form, FormInstance } from 'antd'

export function FormItemBridgeWrapper(item: IRfRenderItem & { depsExec: DepsExec, form: FormInstance }) {
  const { name, itemProps, widget = RfRender.defaultWidget, props, label, mapKeys, form, depsExec, withFormItem = true, display = true } = item
  if (!display)
    return null
  // 传递onChange和onMapKeysChange给自定义的子组件
  const overrideProps: FormItemBridgeProps = {
    ...props,
    rfrender: {
      depsExec,
      form,
      item,
    },
    async onChange(val: unknown) {
      if (name) {
        form.setFieldValue(name, val)
        depsExec(name)
      }
    },
    // 自定义组件需要抛出这个，结果为数组
    onMapKeysChange(valueMap: unknown[]) {
      if (mapKeys?.length) {
        mapKeys.forEach((key: string, index: number) => {
          form.setFieldValue(key, valueMap[index])
          depsExec(key)
        })
      }
    },
  }
  const Component = RfRender.load(widget)
  return (
    <>
      {
        withFormItem
          ? (
            <Form.Item name={name} label={label} {...(itemProps ?? {})}>
              {/* 加载组件，并传入属性 */}
              {Component(overrideProps ?? {})}
            </Form.Item>
            )
          : Component(overrideProps ?? {})
      }
      {
        mapKeys?.length && mapKeys.map((key) => {
          return <Form.Item key={key} name={key} style={{ display: 'none' }} />
        })
      }
    </>
  )
}
