import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { RfRender } from '@rf-render/core'
import { CanModifyConfig, ChangeConfig, ChangeValue, Context, DNCV, IRfRenderItem, OnUpdateFormItem } from '@rf-render/antd'

export interface UseChangeEffectsProps {
  itemConfig: IRfRenderItem
  onUpdateFormItem: OnUpdateFormItem
  updateVision: Dispatch<SetStateAction<boolean>>
}
export type UpdateEffects = (data: CanModifyConfig) => void
export type DoChangeConfig = (changeConfig?: ChangeConfig) => Promise<void>
export type DoChangeValue = (changeConfig?: ChangeValue) => Promise<void>
export function useChangeEffects(props: UseChangeEffectsProps) {
  const { itemConfig, onUpdateFormItem, updateVision } = props
  const [runtimeItemConfig, setRuntimeItemConfig] = useState<IRfRenderItem>(itemConfig)
  const { formName, dependOnMap, form, updateFormData, independentOnsMap } = useContext(Context)
  // 这些都不能更改的直接从itemConfig中取就行，避免多余更新
  const { name, changeValue, changeConfig, mapKeys, independentOn = [] } = itemConfig
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
    // 触发所有字符串dependOn依赖
    const deps = dependOnMap[name] ?? []
    deps.forEach((name) => {
      const { changeValue, changeConfig } = RfRender.getDep(formName, name) ?? {}
      changeValue && changeValue()
      changeConfig && changeConfig()
    })
    // 触发所有对象dependOn依赖
    const oneDeps = independentOnsMap[name] ?? []
    oneDeps.forEach((name) => {
      const { changeValues = [], changeConfigs = [] } = RfRender.getOneDep(formName, name) ?? {}
      changeValues.forEach(cb => cb())
      changeConfigs.forEach(cb => cb())
    })
  }
  // 处理changeConfig
  const doChangeConfig: DoChangeConfig = async (changeConfig) => {
    if (!changeConfig)
      return
    const config = await changeConfig(runtimeItemConfig as any, form!.getFieldsValue())
    config && updateEffects(config)
  }
  // 处理changeValue
  const doChangeValue: DoChangeValue = async (changeValue) => {
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
      // const needChangeDeps = dependOnMap[name] ?? []
      // 更新deps
      callDeps()
      // needChangeDeps.forEach((dep) => {
      //   const { changeValue, changeConfig } = RfRender.getDep(formName, dep!) ?? {}
      //   // 先执行value变更再执行config变更
      //   if (changeValue) {
      //     changeValue()
      //   }
      //   if (changeConfig) {
      //     changeConfig()
      //   }
      // })
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
      changeConfig: () => doChangeConfig(changeConfig as any),
      changeValue: () => doChangeValue(changeValue),
    })

    independentOn.forEach((dep) => {
      const { dependOn, changeConfig, changeValue } = dep
      dependOn.forEach((name) => {
        const depUnit = {
          changeConfigs: new Set<() => any>(),
          changeValues: new Set<() => any>(),
        }
        if (changeConfig) {
          depUnit.changeConfigs.add(() => doChangeConfig(changeConfig as any))
        }
        if (changeValue) {
          depUnit.changeValues.add(() => doChangeValue(changeValue))
        }
        RfRender.addOneDep(formName, name, depUnit)
      })
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
