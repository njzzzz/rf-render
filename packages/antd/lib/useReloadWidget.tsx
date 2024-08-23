import { ComponentType, useContext, useEffect, useMemo, useState } from 'react'
import { FormItemBridgeProps, RfRender } from '@rf-render/core'
import { Context, DoChangeConfig, IRfRenderItem, UpdateEffects } from '@rf-render/antd'

export interface UseReloadWidgetProps {
  itemConfig: IRfRenderItem
  updateEffects: UpdateEffects
  doChangeConfig: DoChangeConfig
  runtimeItemConfig: IRfRenderItem
  customProps: any
}
export function useReloadWidget(props: UseReloadWidgetProps) {
  const { itemConfig, updateEffects, doChangeConfig, runtimeItemConfig, customProps } = props
  const [reloadWidget, setReloadWidget] = useState({})
  const { formName, form, immediateValidate, immediateDeps } = useContext(Context)
  const { widget = RfRender.defaultWidget, name, initConfig, changeConfig, independentOn } = itemConfig
  const { fileName, platform } = runtimeItemConfig
  // 监听表单试图切换事件以切换表单项组件状态
  useEffect(() => {
    const listener = () => {
      setReloadWidget({})
    }
    RfRender.addSwitchListener(formName, listener)
    return () => RfRender.removeSwitchListener(formName, listener)
  }, [])
  // 加载默认配置项
  useEffect(() => {
    const configurePromise = RfRender.loadConfigure(widget, formName, platform, fileName)
    if (configurePromise) {
      configurePromise.then(async ({ default: fn }) => {
        // 初始化操作都是传入itemConfig
        const defaultConfigure = await fn({ itemConfig: runtimeItemConfig })
        // 处理initConfig, 只处理一次
        const config = initConfig ? await initConfig(runtimeItemConfig as any, form.getFieldsValue(), customProps) : {}
        const { props: initProps = {}, itemProps: initItemProps = {} } = config
        const { props: customerProps = {}, itemProps: customerItemProps = {} } = itemConfig
        const { props: defaultProps = {}, itemProps: defaultItemProps = {} } = defaultConfigure
        // 合并默认配置属性，用户自定义优先 default < init < customer
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
          doChangeConfig(changeConfig as any)
          // 处理 independentOn的changeConfig
          independentOn?.map(({ changeConfig }) => doChangeConfig(changeConfig as any))
        }
        // 异步延迟触发校验
        if (immediateValidate) {
          setTimeout(() => {
            form.validateFields([name])
          }, 1)
        }
      })
    }
  }, [reloadWidget, fileName, platform])

  // 加载组件
  const Component = useMemo(() => {
    return RfRender.load(widget, formName, platform, fileName) as ComponentType<FormItemBridgeProps>
  }, [reloadWidget, fileName, platform])
  return {
    reloadWidget,
    Component,
  }
}
