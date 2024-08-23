import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { RfRender } from '@rf-render/core'
import {
  CanModifyConfig,
  ChangeConfig,
  ChangeValue,
  Context,
  DNCV,
  IRfRenderItem,
  OnUpdateFormItem,
} from '@rf-render/antd'

export interface UseChangeEffectsProps {
  itemConfig: IRfRenderItem
  onUpdateFormItem: OnUpdateFormItem
  updateVision: Dispatch<SetStateAction<boolean>>
  customProps?: any
}
export type UpdateEffects = (data: CanModifyConfig) => void
export type DoChangeConfig = (changeConfig?: ChangeConfig) => Promise<void>
export type DoChangeValue = (changeConfig?: ChangeValue) => Promise<void>
export type AddDep = <CC, CV>(dependOn: string[], changeConfig: CC, changeValue: CV) => void
export function useChangeEffects(props: UseChangeEffectsProps) {
  const { itemConfig, onUpdateFormItem, updateVision, customProps } = props
  const [runtimeItemConfig, setRuntimeItemConfig] = useState<IRfRenderItem>(itemConfig)
  const { formName, form, updateFormData } = useContext(Context)
  // 这些都不能更改的直接从itemConfig中取就行，避免多余更新
  const { name, changeValue, changeConfig, mapKeys, independentOn = [], dependOn = [] } = itemConfig
  // 配置发生改变-更新视图,同时处理了formItem和widget
  const updateEffects: UpdateEffects = (data) => {
    // 只能更新这些
    const { props = {}, itemProps = {} } = data
    // 更新formItem
    onUpdateFormItem((config) => {
      return {
        ...config,
        ...data,
        itemProps: {
          ...config.itemProps,
          ...itemProps,
        },
      }
    })
    // 更新当前表单项
    setRuntimeItemConfig((config) => {
      return {
        ...config,
        ...data,
        props: {
          ...config.props,
          ...props,
        },
      }
    })
  }
  // 执行deps
  const callDeps = () => {
    // 触发所有对象dependOn依赖
    const { changeValues = [], changeConfigs = [] } = RfRender.getOneDep(formName, name) ?? {}
    changeValues.forEach(cb => cb())
    changeConfigs.forEach(cb => cb())
  }
  // 处理changeConfig
  const doChangeConfig: DoChangeConfig = async (changeConfig) => {
    if (!changeConfig)
      return
    const config = await changeConfig(runtimeItemConfig as any, form!.getFieldsValue(), customProps)
    config && updateEffects(config)
  }
  // 处理changeValue
  const doChangeValue: DoChangeValue = async (changeValue) => {
    if (!changeValue)
      return
    const [
      value,
      ...mapKeysValue
    ] = await changeValue(form!.getFieldsValue(), customProps)
    // 更新自身值
    if (value !== DNCV) {
      // 更新表单值
      form!.setFieldValue(name, value)
      updateFormData(name, value)
      // 更新deps
      callDeps()
      // 触发表单验证
      form.validateFields([name])
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
  const addDep: AddDep = (dependOn, changeConfig, changeValue) => {
    dependOn?.forEach((name) => {
      const depUnit = {
        changeConfigs: new Set<() => any>(),
        changeValues: new Set<() => any>(),
      }
      if (changeConfig) {
        depUnit.changeConfigs.add(() => doChangeConfig(changeConfig as any))
      }
      if (changeValue) {
        depUnit.changeValues.add(() => doChangeValue(changeValue as any))
      }
      RfRender.addOneDep(formName, name, depUnit)
    })
  }
  // 注册deps
  useEffect(() => {
    addDep(dependOn, changeConfig, changeValue)
    independentOn.forEach((dep) => {
      const { dependOn, changeConfig, changeValue } = dep
      addDep(dependOn, changeConfig, changeValue)
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
