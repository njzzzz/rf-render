import { FormItemUpdateProps, IRfRenderItem, SwitchWidget, getItemStyle, useFormItemUpdate } from '@rf-render/antd'
import { Form } from 'antd'
import { useMemo } from 'react'

export interface FormItemBridgeWrapperProps {
  itemConfig: IRfRenderItem
}
export type OnUpdateFormItem = (val: FormItemUpdateProps) => void
export function FormItemBridgeWrapper(props: FormItemBridgeWrapperProps) {
  const { itemConfig } = props
  const { name, withFormItem = true, mapKeys } = itemConfig
  const { formItemProps, onUpdateFormItem } = useFormItemUpdate({
    itemConfig,
  })
  const { visibility = true, label, itemProps, display = true } = formItemProps
  const { itemStyle } = getItemStyle({ visibility })

  const MapKeysItemForValue = useMemo(() => {
    if (!mapKeys?.length) {
      return null
    }
    return (
      mapKeys.map((name) => {
        return (
          <Form.Item key={name} name={name} label={label} {...itemProps} style={{ display: 'none' }} />
        )
      })
    )
  }, [formItemProps])

  console.log('FormItemBridgeWrapper render')
  return useMemo(() => (
    display
      ? withFormItem
        ? (
          <>
            <Form.Item name={name} label={label} {...itemProps} style={itemStyle}>
              <SwitchWidget itemConfig={itemConfig} onUpdateFormItem={onUpdateFormItem} />
            </Form.Item>
            {MapKeysItemForValue}
          </>
          )
        : (
          <>
            <SwitchWidget itemConfig={itemConfig} onUpdateFormItem={onUpdateFormItem} />
            {MapKeysItemForValue}
          </>

          )
      : null
  ), [formItemProps])
}
