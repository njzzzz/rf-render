import { CanModifyConfig, DNCV, IRfRenderItem } from '@rf-render/antd'
import { useEffect, useMemo, useState } from 'react'
import { FormInstance } from 'antd'
import { RfRender } from '@rf-render/core'

const logColors = ['color: green', 'color: black', 'color: red', 'color: black', 'color: blue']

export function useDeps(schema: IRfRenderItem[], form: FormInstance) {
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
  // 更新配置
  const updateConfig = (config: CanModifyConfig | void, name: string) => {
    if (config) {
      const { ItemProps, label, props } = config
      setRtSchema((schema) => {
        return schema.map((item) => {
          if (item.name === name) {
            item = {
              ...item,
              ItemProps,
              label,
              props,
            }
          }
          return item
        })
      })
    }
  }
  const getItemBridge = (item: IRfRenderItem) => {
    const { changeConfig, changeValue, initConfig, name, mapKeys = [] } = item
    if (name?.length) {
      // 初始化钩子，可异步
      if (initConfig) {
        Promise.resolve(initConfig(item)).then((config) => {
          updateConfig(config, name)
        })
      }
      // 重写changeConfig，加入更新逻辑
      if (changeConfig) {
        item = {
          ...item,
          changeConfig: async (cfg, formData) => {
            const config = await changeConfig(cfg, formData)
            updateConfig(config, name)
          },

        }
      }
      // 重写changeValue，加入更新和赋值逻辑
      if (changeValue) {
        item.changeValue = async (...args) => {
          const values = await changeValue(...args)
          // values 格式为数组 [第一项的值，第二项的值]
          if (values?.length) {
            if (values[0] !== DNCV) {
              // 更新name值
              form.setFieldValue(name, values[0])
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
        }
      }
    }

    // 递归处理layout
    if (item.layout) {
      item.layout = item.layout.map((item) => {
        return getItemBridge(item)
      })
    }
    return item
  }
  useEffect(() => {
    // 初始化
    setRtSchema(rtSchema.map((item) => {
      return getItemBridge(item)
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    rtSchema,
    depsExec,
  }
}
export type DepsExec = ReturnType<typeof useDeps>['depsExec']
