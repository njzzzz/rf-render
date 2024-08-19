import { FormItemUpdateProps, IRfRenderItem, SwitchWidget, getItemStyle, useFormItemUpdate } from '@rf-render/antd'
import { Form } from 'antd'
import { useMemo } from 'react'

export interface FormItemBridgeWrapperProps {
  itemConfig: IRfRenderItem
}
export type OnUpdateFormItem = (val: FormItemUpdateProps) => void
export function FormItemBridgeWrapper(props: FormItemBridgeWrapperProps) {
  const { itemConfig } = props
  const { name, withFormItem = true, mapKeys, layout = [] } = itemConfig
  const { formItemProps, onUpdateFormItem } = useFormItemUpdate({
    itemConfig,
  })
  const { visibility = true, label, itemProps = {}, display = true } = formItemProps
  const { itemStyle } = getItemStyle({ visibility })
  const { style = {} } = itemProps
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
  // console.count('form item wrapper render count')
  // layout组件消除其底部的margin
  const overrideItemStyle = {
    ...style,
  }
  if (layout.length) {
    overrideItemStyle.marginBottom = 0
  }
  return useMemo(() => (
    display
      ? withFormItem
        ? (
          <>
            <Form.Item name={name} label={label} {...itemProps} style={{ ...itemStyle, ...overrideItemStyle }}>
              <SwitchWidget itemConfig={itemConfig} onUpdateFormItem={onUpdateFormItem} />
            </Form.Item>
            {MapKeysItemForValue}
          </>
          )
        : (
          <div style={{ ...itemStyle, ...style }}>
            <SwitchWidget itemConfig={itemConfig} onUpdateFormItem={onUpdateFormItem} />
            {MapKeysItemForValue}
          </div>

          )
      : null
  ), [formItemProps])
}
