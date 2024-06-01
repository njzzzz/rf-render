import { CanModifyConfig, DNCV, IRfRenderItem } from '@rf-render/antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormInstance } from 'antd'
import { RfRender } from '@rf-render/core'

const logColors = ['color: green', 'color: black', 'color: red', 'color: black', 'color: blue']
interface OverrideItem { originalChangeConfig?: IRfRenderItem['changeConfig'], originalChangeValue?: IRfRenderItem['changeValue'] }
export function useDeps(schema: IRfRenderItem[], form: FormInstance) {
  const init = useRef(false)
  const [rtSchema, setRtSchema] = useState(schema)

  function genDependOnMaps(schema: IRfRenderItem[], acc: Record<string, IRfRenderItem[]> = {}) {
    schema.forEach((item) => {
      const { dependOn = [], layout = [] } = item
      dependOn.forEach((dep) => {
        acc[dep] = acc[dep] ? [...acc[dep], item] : [item]
      })
      // 递归处理layout
      if (layout.length) {
        genDependOnMaps(layout, acc)
      }
    })
    return acc
  }

  const dependOnMaps = useMemo(() => {
    return genDependOnMaps(rtSchema)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtSchema])

  async function depsExec(nameOrKey: string) {
    const deps = dependOnMaps[nameOrKey]
    if (deps?.length) {
      const promises = deps.reduce((acc: unknown[], dep) => {
        const { changeConfig, changeValue, ...config } = dep
        const formData = form.getFieldsValue()
        if (changeConfig) {
          RfRender.debug(`表单%c【${nameOrKey}】%c变动，触发了表单%c【${config.name}】%c的%c 【changeConfig】`, ...logColors)
          acc.push(changeConfig(config as any, formData))
        }
        if (changeValue) {
          acc.push(changeValue(formData))
          RfRender.debug(`表单%c【${nameOrKey}】%c变动，触发了表单%c【${config.name}】%c的%c 【changeValue】`, ...logColors)
        }
        return acc
      }, [])
      await Promise.all(promises)
    }
  }
  const updateWithLayout = (schema: IRfRenderItem[], config: CanModifyConfig, name: string) => {
    const { itemProps, label, props, display, visibility } = config
    return schema.map((item) => {
      if (item.name === name) {
        Object.assign(item, {
          itemProps,
          label,
          props,
          display,
          visibility,
        })
      }
      if (item.layout) {
        item.layout = updateWithLayout(item.layout, config, name)
      }
      return item
    })
  }
  // 更新配置
  const updateConfig = (config: CanModifyConfig | void, name: string) => {
    if (config) {
      setRtSchema((schema) => {
        return updateWithLayout(schema, config, name)
      })
    }
  }
  const getItemBridge = async (item: IRfRenderItem & OverrideItem) => {
    const configure = await RfRender.loadConfigure(item.widget || RfRender.defaultWidget)
    const { props = {}, itemProps = {} } = item
    if (configure) {
      const { default: getConfigure } = configure
      const { props: cfProps = {}, itemProps: cfItemProps = {}, ...cfg } = await getConfigure({ depsExec, form, item })
      /**
       * 合并配置，props， itemProps 合并第一层
       */
      Object.assign(item, {
        ...cfg,
        ...item,
        props: {
          ...cfProps,
          ...props,
        },
        itemProps: {
          ...cfItemProps,
          ...itemProps,
        },
      })
    }

    const { changeConfig, changeValue, initConfig, name, mapKeys = [] } = item
    item.originalChangeConfig = item.originalChangeConfig || changeConfig
    item.originalChangeValue = item.originalChangeValue || changeValue
    const { originalChangeConfig, originalChangeValue } = item
    if (name?.length) {
      // 初始化钩子，可异步
      if (initConfig) {
        Promise.resolve(initConfig(item as any)).then((config) => {
          updateConfig(config, name)
        })
      }
      // 重写changeConfig，加入更新逻辑
      if (changeConfig) {
        Object.assign(item, {
          changeConfig: async (cfg: any, formData: any) => {
            const config = await originalChangeConfig!(cfg, formData)
            updateConfig(config, name)
          },
        })
      }
      // 重写changeValue，加入更新和赋值逻辑
      if (changeValue) {
        Object.assign(item, {
          changeValue: async (formData: any) => {
            const values = await originalChangeValue!(formData)
            // values 格式为数组 [第一项的值，第二项的值]
            if (values?.length) {
              if (values[0] !== DNCV) {
                // 更新name值
                form.setFieldValue(name, values[0])
                // 初始化不要触发校验
                !init.current && form.validateFields([name])
                // 触发依赖项更新
                depsExec(name)
              }
              mapKeys.forEach((key, index) => {
                const mapValue = values[index + 1]
                if (mapValue !== DNCV) {
                  // 更新mapKeys的值
                  form.setFieldValue(key, mapValue)
                  // 触发依赖项更新
                  depsExec(key)
                }
              })
            }
          },
        })
      }
    }

    // 递归处理layout
    if (item.layout) {
      item.layout = await Promise.all(item.layout.map((item) => {
        return getItemBridge(item)
      }))
    }
    return item
  }
  useEffect(() => {
    // 初始化, 覆写changeConfig和changeValue等
    Promise.all(rtSchema.map(async (item) => {
      return getItemBridge(item)
    })).then((schema) => {
      setRtSchema(schema)
      // 初始化完成执行一次change函数
      initRunChange()
    }).catch((err) => {
      console.error('表单初始化失败！', err)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function initRunChange() {
    init.current = true
    await Promise.all(Object.keys(dependOnMaps).map(name => depsExec(name)))
    init.current = false
  }
  return {
    rtSchema,
    depsExec,
  }
}
export type DepsExec = ReturnType<typeof useDeps>['depsExec']
