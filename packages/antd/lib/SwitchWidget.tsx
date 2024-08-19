import { useContext, useMemo, useState } from 'react'
import {
  Context,
  DNCV,
  IRfRenderItem,
  OnUpdateFormItem,
  useChangeEffects,
  useReloadWidget,
} from '@rf-render/antd'

export interface SwitchWidgetProps {
  itemConfig: IRfRenderItem
  onUpdateFormItem: OnUpdateFormItem
  // antd 默认的 onChange for validate
  onChange?: any
}

export function SwitchWidget(props: SwitchWidgetProps) {
  const { itemConfig, onUpdateFormItem } = props
  const { name, mapKeys } = itemConfig
  const [vision, updateVision] = useState(false)
  const { form, updateFormData } = useContext(Context)
  const { runtimeItemConfig, updateEffects, doChangeConfig, callDeps } = useChangeEffects({ itemConfig, onUpdateFormItem, updateVision })
  const { Component } = useReloadWidget({
    updateEffects,
    doChangeConfig,
    itemConfig,
    runtimeItemConfig,
  })
  // console.count('switch widget render count')
  // 用于value变更时更新组件
  const value = form.getFieldValue(name)
  return useMemo(() => {
    return (
      // reloadWidget 标记重新加载组件
      <Component
        itemConfig={runtimeItemConfig}
        onChange={([val, ...mapKeysValues]: unknown[]) => {
          let needUpdate = false
          if (mapKeys?.length) {
            mapKeys.forEach((mapKey, index) => {
              const mapKeyValue = mapKeysValues[index]
              if (mapKeyValue !== DNCV) {
                form!.setFieldValue(mapKey, mapKeyValue)
                updateFormData(mapKey, mapKeyValue)
                needUpdate = true
              }
            })
          }
          if (val !== DNCV) {
            form!.setFieldValue(name, val)
            form.validateFields([name])
            updateFormData(name, val)
            callDeps()
          }
          if (needUpdate) {
            // mapKeys值修改时也要触发更新
            updateVision(v => !v)
          }
        }}
      >
      </Component>
    )
  }, [Component, runtimeItemConfig, vision, value])
}
