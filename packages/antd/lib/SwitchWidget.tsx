import { ComponentType, useContext, useMemo } from 'react'
import { FormItemBridgeProps, RfRender } from '@rf-render/core'
import { Context, DNCV, SwitchWidgetProps, useChangeEffects, useFormValue, useReloadWidget } from '@rf-render/antd'

export function SwitchWidget(props: SwitchWidgetProps) {
  const { itemConfig, onUpdateFormItem } = props
  const { widget, name, mapKeys = [] } = itemConfig
  const { value, mapKeysValue } = useFormValue({ itemConfig })
  const { runtimeItemConfig } = useChangeEffects({ itemConfig, onUpdateFormItem })
  const { formName, updateFormData } = useContext(Context)
  const { reloadWidget } = useReloadWidget()

  return useMemo(() => {
    console.log('Component render')
    const Component = RfRender.load(widget, formName) as ComponentType<FormItemBridgeProps>
    return (
    // reloadWidget 标记重新加载组件
      <Component
        reloadWidget={reloadWidget}
        itemConfig={runtimeItemConfig}
        mapKeysValue={mapKeysValue}
        value={value}
        onChange={([val, ...mapKeysValues]: unknown[]) => {
          mapKeys.forEach((mapKey, index) => {
            const mapKeyValue = mapKeysValues[index]
            if (mapKeyValue !== DNCV) {
              updateFormData(mapKey, mapKeyValue)
            }
          })
          if (value !== DNCV) {
            updateFormData(name, val)
          }
        }}
      >
      </Component>
    )
  }, [widget, formName, reloadWidget, runtimeItemConfig, mapKeysValue, value, mapKeys, updateFormData, name])
}
