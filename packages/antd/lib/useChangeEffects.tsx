import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { RfRender } from '@rf-render/core'
import { CanModifyConfig, Context, DNCV, IRfRenderItem, OnUpdateFormItem } from '@rf-render/antd'

export interface UseChangeEffectsProps {
  itemConfig: IRfRenderItem
  onUpdateFormItem: OnUpdateFormItem
  updateVision: Dispatch<SetStateAction<boolean>>
}
export type UpdateEffects = (data: CanModifyConfig) => void
export type DoChangeConfig = () => Promise<void>
export function useChangeEffects(props: UseChangeEffectsProps) {
  const { itemConfig, onUpdateFormItem, updateVision } = props
  const [runtimeItemConfig, setRuntimeItemConfig] = useState<IRfRenderItem>(itemConfig)
  const { formName, schemaEffectMap, form, updateFormData } = useContext(Context)
  // 这些都不能更改的直接从itemConfig中取就行，避免多余更新
  const { name, changeValue, changeConfig, mapKeys } = itemConfig
  // 配置发生改变-更新视图,同时处理了formItem和widget
  const updateEffects: UpdateEffects = (data) => {
    // 只能更新这些
    const { label, itemProps, display, visibility, props, fileName, platform } = data
    // 更新formItem
    onUpdateFormItem({ label, itemProps, display, visibility })
    // 更新当前表单项
    setRuntimeItemConfig((config) => {
      const {
        itemProps: oldItemProp,
        props: oldProps,
        label: oldLabel,
        display: oldDisplay,
        visibility: oldVisibility,
        fileName: oldFileName,
        platform: oldPlatform,
      } = config
      return {
        ...config,
        fileName: fileName ?? oldFileName,
        platform: platform ?? oldPlatform,
        label: label ?? oldLabel,
        itemProps: {
          ...oldItemProp,
          ...itemProps,
        },
        display: display ?? oldDisplay,
        visibility: visibility ?? oldVisibility,
        props: {
          ...oldProps,
          ...props,
        },

      }
    })
  }
  // 执行deps
  const callDeps = () => {
    const deps = schemaEffectMap[name] ?? []
    deps.forEach((name) => {
      const { changeValue, changeConfig } = RfRender.getDep(formName, name) ?? {}
      changeValue && changeValue()
      changeConfig && changeConfig()
    })
  }
  // 处理changeConfig
  const doChangeConfig: DoChangeConfig = async () => {
    if (!changeConfig)
      return
    // 只能更新这些
    const config = await changeConfig(runtimeItemConfig as any, form!.getFieldsValue())
    config && updateEffects(config)
  }
  // 处理changeValue
  const doChangeValue = async () => {
    if (!changeValue)
      return
    const [
      value,
      ...mapKeysValue
    ] = await changeValue(form!.getFieldsValue())
    // 更新自身值
    if (value !== DNCV) {
      // 更新表单值
      form.validateFields([name])
      form!.setFieldValue(name, value)
      updateFormData(name, value)
      const needChangeDeps = schemaEffectMap[name] ?? []
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
    if (mapKeys?.length) {
      let needUpdate = false
      mapKeys.forEach((mapKey, index) => {
        const mpValue = mapKeysValue[index]
        if (mpValue !== DNCV) {
          form!.setFieldValue(mapKey, mpValue)
          updateFormData(mapKey, mpValue)
          needUpdate = true
        }
      })
      if (needUpdate) {
        // mapKeys值修改时也要触发更新
        updateVision(v => !v)
      }
    }
  }

  // 注册deps
  useEffect(() => {
    RfRender.addDep(formName, name, {
      changeConfig: doChangeConfig,
      changeValue: doChangeValue,
    })
  }, [])

  return {
    runtimeItemConfig,
    updateEffects,
    doChangeConfig,
    doChangeValue,
    callDeps,
  }
}
