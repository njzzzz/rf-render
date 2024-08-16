import { FormItemUpdateProps, IRfRenderItem, SwitchWidget, getItemStyle, useFormItemUpdate } from '@rf-render/antd'
import { Form } from 'antd'

export interface SwitchWidgetProps {
  itemConfig: IRfRenderItem
  onUpdateFormItem: OnUpdateFormItem
}

export interface FormItemBridgeWrapperProps {
  itemConfig: IRfRenderItem
}
export type OnUpdateFormItem = (val: FormItemUpdateProps) => void
export function FormItemBridgeWrapper(props: FormItemBridgeWrapperProps) {
  const { itemConfig } = props
  const { name, withFormItem = true } = itemConfig
  const { formItemProps, onUpdateFormItem } = useFormItemUpdate({
    itemConfig,
  })
  const { visibility, label, itemProps, display = true } = formItemProps
  const { itemStyle } = getItemStyle({ visibility })
  console.log('FormItemBridgeWrapper render')
  return (
    <>
      {
        display
          ? withFormItem
            ? (
              <Form.Item name={name} label={label} {...itemProps} style={itemStyle}>
                <SwitchWidget itemConfig={itemConfig} onUpdateFormItem={onUpdateFormItem} />
              </Form.Item>
              )
            : (
              <SwitchWidget itemConfig={itemConfig} onUpdateFormItem={onUpdateFormItem} />
              )
          : null
}
    </>
  )
}
