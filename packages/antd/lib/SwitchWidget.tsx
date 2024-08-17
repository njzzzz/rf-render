import { ComponentType, useContext, useEffect, useMemo, useState } from 'react'
import { FormItemBridgeProps, RfRender } from '@rf-render/core'
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
  const { widget = RfRender.defaultWidget, name, mapKeys, initConfig } = itemConfig
  const { reloadWidget } = useReloadWidget()
  const [vision, updateVision] = useState(false)
  const { formName, schemaEffectMap, form, updateFormData, immediateValidate, immediateDeps } = useContext(Context)
  const { runtimeItemConfig, updateEffects, doChangeConfig } = useChangeEffects({ itemConfig, onUpdateFormItem, updateFormData, updateVision })
  // 加载默认配置项
  useEffect(() => {
    const configurePromise = RfRender.loadConfigure(widget, formName)
    if (configurePromise) {
      configurePromise.then(async ({ default: fn }) => {
        // 初始化操作都是传入itemConfig
        const defaultConfigure = await fn({ itemConfig })
        // 处理initConfig, 只处理一次
        const config = initConfig ? await initConfig(itemConfig as any) : {}
        const { props: initProps = {}, itemProps: initItemProps = {} } = config
        const { props: customerProps = {}, itemProps: customerItemProps = {} } = itemConfig
        const { props: defaultProps = {}, itemProps: defaultItemProps = {} } = defaultConfigure
        // 合并默认配置属性，用户自定义优先 defaut < init < customer
        updateEffects({
          ...defaultConfigure,
          ...config,
          ...itemConfig,
          props: {
            ...defaultProps as any,
            ...initProps,
            ...customerProps,
          },
          itemProps: {
            ...defaultItemProps,
            ...initItemProps,
            ...customerItemProps,
          },
        })
        /**
         * 此处为真正初始化完成, 初始化完成后的操作在此处完成
         */
        if (immediateDeps) {
          // 默认只改配置，不要修改用户值，初始值的正确需要用户自己保证
          await doChangeConfig()
        }
        // 异步延迟触发校验
        if (immediateValidate) {
          setTimeout(() => {
            form.validateFields([name])
          }, 1)
        }
      })
    }
  }, [reloadWidget])

  // 加载组件
  const Component = useMemo(() => {
    return RfRender.load(widget, formName) as ComponentType<FormItemBridgeProps>
  }, [reloadWidget])

  // 执行deps
  const callDeps = () => {
    const deps = schemaEffectMap[name] ?? []
    deps.forEach((name) => {
      const { changeValue, changeConfig } = RfRender.getDep(formName, name) ?? {}
      changeValue && changeValue()
      changeConfig && changeConfig()
    })
  }

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
