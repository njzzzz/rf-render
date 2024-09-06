import { CustomerLayout, IRfRenderItem, MaybePromise, SwitchWidget, getItemStyle, useFormItemUpdate } from '@rf-render/antd'
import { Form } from 'antd'
import { CSSProperties, useMemo } from 'react'

export interface FormItemBridgeWrapperProps {
  itemConfig: IRfRenderItem
  /**
   * @description 表单项值发生变动触发 [value, ...mapKeysValue]
   */
  onValuesChange?: (values: [unknown, unknown]) => MaybePromise<any>
  /**
   * @description 会在changeConfig 和changeValue时作为最后一项提供
   */
  customProps?: any
  /**
   * @description Form.Item style
   */
  style?: CSSProperties
}
export function FormItemBridgeWrapper(props: FormItemBridgeWrapperProps) {
  const { itemConfig, onValuesChange, customProps, style: propsStyle = {} } = props
  const { name, withFormItem = true, mapKeys, layout = [], widget, hideLabelUi = false } = itemConfig
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
    ...propsStyle,
    ...style,
  }
  // layout组件消除其底部的margin
  const widgetProps = itemConfig.props as CustomerLayout ?? {}
  if (widget === 'Layout' && layout.length && widgetProps.mode === 'independent') {
    overrideItemStyle.marginBottom = 0
  }

  return useMemo(() => (
    display
      ? withFormItem
        ? (
          <>
            <Form.Item name={name} label={hideLabelUi ? undefined : label} {...itemProps} style={{ ...itemStyle, ...overrideItemStyle }}>
              <SwitchWidget itemConfig={itemConfig} onUpdateFormItem={onUpdateFormItem} onValuesChange={onValuesChange} customProps={customProps} />
            </Form.Item>
            {MapKeysItemForValue}
          </>
          )
        : (
          <div style={{ ...itemStyle, ...style }}>
            <SwitchWidget itemConfig={itemConfig} onUpdateFormItem={onUpdateFormItem} onValuesChange={onValuesChange} customProps={customProps} />
            {MapKeysItemForValue}
          </div>
          )
      : null
  ), [formItemProps])
}
