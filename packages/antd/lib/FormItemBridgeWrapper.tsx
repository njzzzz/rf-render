import { FormItemBridgeProps, RfRender } from '@rf-render/core'
import { DepsExec, IRfRenderItem } from '@rf-render/antd'
import { Form, FormInstance } from 'antd'

export function FormItemBridgeWrapper(item: IRfRenderItem & { depsExec: DepsExec, form: FormInstance }) {
  const { name, ItemProps, widget = RfRender.defaultWidget, props, label, mapKeys, form, depsExec } = item
  // 传递onChange和onMapKeysChange给自定义的子组件
  const overrideProps: FormItemBridgeProps = {
    ...props,
    async onChange(val: unknown) {
      form.setFieldValue(name, val)
      depsExec(name)
    },
    // 自定义组件需要抛出这个，结果为对象格式
    onMapKeysChange(valueMap: Record<string, unknown>) {
      if (mapKeys?.length) {
        mapKeys.forEach((key: string, index: number) => {
          form.setFieldValue(key, valueMap[index])
          depsExec(key)
        })
      }
    },
  }
  return (
    <>
      <Form.Item key={name} name={name} label={label} {...(ItemProps ?? {})}>
        {/* 加载组件，并传入属性 */}
        {RfRender.load(widget)(overrideProps ?? {})}
      </Form.Item>
      {
       mapKeys?.length && mapKeys.map((key) => {
         return <Form.Item key={key} name={key} style={{ display: 'none' }} />
       })
      }
    </>
  )
}
