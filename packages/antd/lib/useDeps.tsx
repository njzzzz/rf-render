import { DNCV, IRfRenderItem } from '@rf-render/antd'
import { useEffect, useMemo, useState } from 'react'
import { FormInstance } from 'antd'

export function useDeps(schema: IRfRenderItem[], form: FormInstance) {
  const [rtSchema, setRtSchema] = useState(schema)

  const dependOnMaps = useMemo(() => {
    return rtSchema.reduce((acc: Record<string, IRfRenderItem[]>, item) => {
      const { dependOn = [] } = item
      dependOn.forEach((dep) => {
        acc[dep] = acc[dep] ? [...acc[dep], item] : [item]
      })
      return acc
    }, {})
  }, [rtSchema])

  async function depsExec(nameOrKey: string) {
    const deps = dependOnMaps[nameOrKey]
    if (deps?.length) {
      const promises = deps.reduce((acc: unknown[], dep) => {
        const { changeConfig, changeValue, ...config } = dep
        const formData = form.getFieldsValue()
        if (changeConfig) {
          acc.push(changeConfig(config as any, formData))
        }
        if (changeValue) {
          acc.push(changeValue(formData))
        }
        return acc
      }, [])
      await Promise.all(promises)
    }
  }
  useEffect(() => {
  // 初始化
    setRtSchema(rtSchema.map((item) => {
      const { changeConfig, changeValue } = item
      if (changeConfig) {
        item = {
          ...item,
          changeConfig: async (cfg, formData) => {
            const config = await changeConfig(cfg, formData)
            if (config) {
              setRtSchema((schema) => {
                return schema.map((item) => {
                  if (item.name === cfg.name) {
                    item = {
                      ...item,
                      ...config,
                    }
                  }
                  return item
                })
              })
            }
          },

        }
      }
      if (changeValue) {
        const { mapKeys = [] } = item
        item.changeValue = async (...args) => {
          const values = await changeValue(...args)
          // values 格式为数组 [第一项的值，第二项的值]
          if (values?.length) {
            if (values[0] !== DNCV) {
            // 更新name值
              form.setFieldValue(item.name, values[0])
              // 触发依赖项更新
              depsExec(item.name)
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
      return item
    }))
  }, [])

  return {
    rtSchema,
    depsExec,
  }
}
export type DepsExec = ReturnType<typeof useDeps>['depsExec']