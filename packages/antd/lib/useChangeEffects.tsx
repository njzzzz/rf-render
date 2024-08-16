import { useCallback, useContext, useEffect, useState } from 'react'
import { RfRender } from '@rf-render/core'
import { CanModifyConfig, Context, DNCV, IRfRenderItem, OnUpdateFormItem } from '@rf-render/antd'

export interface UseChangeEffectsProps {
  itemConfig: IRfRenderItem
  onUpdateFormItem: OnUpdateFormItem
}

export function useChangeEffects(props: UseChangeEffectsProps) {
  const { itemConfig, onUpdateFormItem } = props
  const [runtimeItemConfig, setRuntimeItemConfig] = useState<IRfRenderItem>(itemConfig)
  const { formName, formData, updateFormData, schemaEffectMap } = useContext(Context)
  // 这些都不能更改的直接从itemConfig中取就行，避免多余更新
  const { name, changeValue, changeConfig, mapKeys = [], initConfig } = itemConfig
  // 更新视图,同时处理了formItem和widget
  const updateEffects = useCallback((data: CanModifyConfig) => {
    // 只能更新这些
    const { label, itemProps, display, visibility, props } = data
    // 更新formItem
    onUpdateFormItem({ label, itemProps, display, visibility })
    // 更新当前表单项
    setRuntimeItemConfig((config) => {
      return {
        ...config,
        label,
        itemProps,
        display,
        visibility,
        props,
      }
    })
  }, [onUpdateFormItem])

  // 处理initConfig
  useEffect(() => {
    if (initConfig) {
      Promise.resolve(initConfig(itemConfig)).then((config) => {
        updateEffects(config)
      })
    }
  }, [initConfig, itemConfig, updateEffects])
  // 处理changeConfig
  const doChangeConfig = useCallback(async () => {
    if (!changeConfig)
      return
    // 只能更新这些
    const config = await changeConfig(runtimeItemConfig, formData.current)
    updateEffects(config)
  }, [changeConfig, formData, runtimeItemConfig, updateEffects])
  // 处理changeValue
  const doChangeValue = useCallback(async () => {
    if (!changeValue)
      return
    const [
      value,
      ...mapKeysValue
    ] = await changeValue(formData.current)
    // 更新自身值
    if (value !== DNCV) {
      // 更新表单值
      updateFormData(name, value)
      const needChangeDeps = schemaEffectMap[name]
      // 更新deps
      needChangeDeps.forEach((dep) => {
        const { changeValue, changeConfig } = RfRender.getDep(formName, dep!) ?? {}
        // 先执行value变更再执行config变更
        if (changeValue) {
          changeValue()
        }
        if (changeConfig) {
          changeConfig()
        }
      })
    }
    // 更新mapKeys
    mapKeys.forEach((key, index) => {
      const mpValue = mapKeysValue[index]
      if (mpValue !== DNCV) {
        updateFormData(key, mpValue)
      }
    })
  }, [changeValue, formData, mapKeys, updateFormData, name, schemaEffectMap, formName])

  // 注册deps
  useEffect(() => {
    RfRender.addDep(formName, name, {
      changeConfig: doChangeConfig,
      changeValue: doChangeValue,
    })
    return () => RfRender.removeDep(formName, name)
  }, [doChangeConfig, doChangeValue, formName, name])

  return {
    runtimeItemConfig,
  }
}
