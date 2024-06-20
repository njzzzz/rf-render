/* eslint-disable react-hooks/exhaustive-deps */
import { FormItemBridgeProps, RfRender } from '@rf-render/core'
import {
  CanModifyConfig,
  DNCV,
  DependOnMaps,
  IRfRenderItem,
  SuspenseWrapper,
  getItemStyle,
} from '@rf-render/antd'
import { Form, FormInstance } from 'antd'
import { lazy, useEffect, useState } from 'react'

export interface FormItemBridgeWrapperAttachProps {
  dependOnMaps: DependOnMaps
  form: FormInstance
  formName: symbol
  immediateDeps?: boolean
}
export type FormItemBridgeWrapperProps = IRfRenderItem &
  FormItemBridgeWrapperAttachProps

export function FormItemBridgeWrapper(item: FormItemBridgeWrapperProps) {
  const [Component, setComponent] = useState<ReturnType<typeof lazy> | null>(
    null,
  )
  const [configure, setConfigure] = useState<CanModifyConfig>({})
  const [runtimeItem, setRuntimeItem]
    = useState<FormItemBridgeWrapperProps>(item)
  const [reload, setReload] = useState(false)
  useEffect(() => {
    // 调用RfRender switch的时候，触发组件刷新
    const listener = () => {
      setReload(!reload)
    }
    RfRender.addSwitchListener(listener)
    return () => {
      RfRender.removeSwitchListener(listener)
    }
  }, [reload])
  // 合并configure---------------------------
  const config = {
    ...configure,
    ...runtimeItem,
    props: {
      ...configure.props,
      ...runtimeItem.props,
    },
    itemProps: {
      ...configure.itemProps,
      ...runtimeItem.itemProps,
    },
  }
  const {
    name,
    itemProps,
    widget = RfRender.defaultWidget,
    props,
    label,
    mapKeys,
    form,
    dependOnMaps,
    // 布局组件默认不需要FormItem
    withFormItem = !config.layout?.length,
    display = true,
    visibility = true,
    formName,
    initConfig,
    immediateDeps = true,
  } = config
  // -------------------------------------

  const component = RfRender.components[widget]!
  const {
    dependOnMaps: _,
    form: __,
    changeConfig,
    changeValue,
    ...runtimeItemFields
  } = config
  const rfrender = {
    dependOnMaps,
    form,
    item: runtimeItemFields,
    formName,
    immediateDeps,
  }
  // 初始化配置
  if (initConfig) {
    Promise.resolve(initConfig(config)).then((newConfig) => {
      const {
        itemProps = {},
        label = '',
        props = {},
        display = true,
        visibility = true,
      } = newConfig
      setRuntimeItem(item => ({
        ...item,
        itemProps,
        label,
        props: props as any,
        display,
        visibility,
      }))
    })
  }
  // 注入更新钩子
  useEffect(() => {
    if (!name?.length)
      return
    RfRender.addDep(formName, name!, {
      changeConfig: async () => {
        if (!changeConfig)
          return
        const formData = form.getFieldsValue(true)
        const newConfig = await changeConfig(config, formData)
        const {
          itemProps = {},
          label = '',
          props = {},
          display = true,
          visibility = true,
        } = newConfig ?? {}
        setRuntimeItem(item => ({
          ...item,
          itemProps,
          label,
          props: props as any,
          display,
          visibility,
        }))
      },
      changeValue: async () => {
        if (!changeValue)
          return
        const formData = form.getFieldsValue(true)
        const values = await changeValue(formData)
        // values 格式为数组 [第一项的值，第二项的值]
        if (values?.length) {
          if (values[0] !== DNCV) {
            // 更新name值
            form.setFieldValue(name, values[0])
            form.validateFields([name])
            const deps = dependOnMaps.deps[name!] ?? []
            deps.forEach(async ({ name }) => {
              const { changeValue, changeConfig }
                = RfRender.getDep(formName, name!) ?? {}
              changeValue && (await changeValue())
              changeConfig && (await changeConfig())
            })
          }
          if (mapKeys?.length) {
            mapKeys.forEach((key, index) => {
              const mapValue = values[index + 1]
              if (mapValue !== DNCV) {
                // 更新mapKeys的值
                form.setFieldValue(key, mapValue)
                const deps = dependOnMaps.deps[key] ?? []
                deps.forEach(async ({ name }) => {
                  const { changeValue, changeConfig }
                    = RfRender.getDep(formName, name!) ?? {}
                  changeValue && (await changeValue())
                  changeConfig && (await changeConfig())
                })
              }
            })
          }
        }
      },
    })
    /**
     * 保证所有异步表单组件均加载完成后执行一次dependOn
     */
    if (immediateDeps) {
      const deps = RfRender.getAllDeps(formName) ?? []
      const isAllLazyComponentsLoaded = deps.length === Object.keys(dependOnMaps.maps).length
      if (isAllLazyComponentsLoaded) {
        deps.forEach(async (dep) => {
          const { changeConfig, changeValue } = dep
          await changeValue()
          await changeConfig()
        })
      }
    }
    return () => {
      RfRender.removeDep(formName, name!)
    }
  }, [])
  // reload的时候重新加载组件和默认配置
  useEffect(() => {
    const dynamicConfigure = RfRender.loadConfigure(widget)
    if (dynamicConfigure) {
      dynamicConfigure.then(async ({ default: defaultExport }) => {
        const configure = await defaultExport(rfrender)
        if (configure) {
          setConfigure(configure)
        }
        setComponent(RfRender.load(widget))
      })
    }
  }, [reload])

  if (typeof name === 'string' && !name?.length) {
    console.log(`表单项${runtimeItem}缺少name字段，可能导致异常！`)
  }
  if (!display || !component || !Component)
    return null

  // 传递onChange和onMapKeysChange给自定义的子组件
  const overrideProps: FormItemBridgeProps = {
    ...props,
    rfrender,
    async onChange(val: unknown) {
      if (name?.length) {
        form.setFieldValue(name, val)
        const deps = dependOnMaps.deps[name] ?? []
        deps.forEach(async ({ name }) => {
          const { changeValue, changeConfig }
            = RfRender.getDep(formName, name!) ?? {}
          changeValue && (await changeValue())
          changeConfig && (await changeConfig())
        })
      }
    },
    // 自定义组件需要抛出这个，结果为数组
    onMapKeysChange(valueMap: unknown[]) {
      if (mapKeys?.length) {
        mapKeys.forEach((key: string, index: number) => {
          form.setFieldValue(key, valueMap[index])
          const deps = dependOnMaps.deps[key] ?? []
          deps.forEach(async ({ name }) => {
            const { changeValue, changeConfig }
              = RfRender.getDep(formName, name!) ?? {}
            changeValue && (await changeValue())
            changeConfig && (await changeConfig())
          })
        })
      }
    },
  }
  const { itemStyle } = getItemStyle({ visibility })
  return (
    <>
      {withFormItem
        ? (
          <Form.Item name={name} label={label} {...itemProps} style={itemStyle}>
            {/* 加载组件，并传入属性 */}
            <SuspenseWrapper
              Component={Component!}
              component={component}
              formItemBridgeProps={overrideProps}
            />
          </Form.Item>
          )
        : (
          <SuspenseWrapper
            Component={Component!}
            component={component}
            formItemBridgeProps={overrideProps}
          />
          )}
      {mapKeys?.length
      && mapKeys.map((key) => {
        return <Form.Item key={key} name={key} style={{ display: 'none' }} />
      })}
    </>
  )
}
