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
  onValuesChange?: any
  customProps?: any
}

export function SwitchWidget(props: SwitchWidgetProps) {
  const { itemConfig, onUpdateFormItem, onValuesChange, customProps } = props
  const { name, mapKeys } = itemConfig
  const [vision, updateVision] = useState(false)
  const { form, updateFormData } = useContext(Context)
  const { runtimeItemConfig, updateEffects, callDeps, doChangeConfig } = useChangeEffects({ itemConfig, onUpdateFormItem, updateVision, customProps })
  const { Component } = useReloadWidget({
    updateEffects,
    doChangeConfig,
    itemConfig,
    runtimeItemConfig,
    customProps,
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
          let mapValues: any = []
          if (mapKeys?.length) {
            mapValues = mapKeys.map((mapKey, index) => {
              const mapKeyValue = mapKeysValues[index]
              if (mapKeyValue !== DNCV) {
                form!.setFieldValue(mapKey, mapKeyValue)
                updateFormData(mapKey, mapKeyValue)
                needUpdate = true
              }
              return form.getFieldValue(mapKey)
            })
          }
          if (val !== DNCV) {
            form!.setFieldValue(name, val)
            form.validateFields([name])
            updateFormData(name, val)
            // FIX: 修复更新值需要发生在callDeps()之前，否则传入changeEffect的值为旧值
            onValuesChange && onValuesChange([form.getFieldValue(name), ...mapValues])
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
