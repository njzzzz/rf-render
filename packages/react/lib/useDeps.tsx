import { DNCV, FormRenderProps, IRfRenderItem } from '@rf-render/react'
import { useRef } from 'react'
import { FormInstance } from 'antd'
import { FormItemBridgeWrapperHandle } from './FormItemBridgeWrapper'

export function useDeps(schema: FormRenderProps['schema'], form: FormInstance) {
  const items = useRef<Record<string, FormItemBridgeWrapperHandle>>({})
  const initializeRefs = (name: string) => (ref: FormItemBridgeWrapperHandle) => {
    items.current[name] = ref
  }

  const dependOnMaps = schema.reduce((acc: Record<string, IRfRenderItem[]>, item) => {
    const { dependOn = [] } = item
    dependOn.forEach((dep) => {
      acc[dep] = acc[dep] ? [...acc[dep], item] : [item]
    })
    return acc
  }, {})

  function depsExec(nameOrKey: string) {
    const deps = dependOnMaps[nameOrKey]
    if (deps?.length) {
      deps.forEach((dep) => {
        const { changeConfig, changeValue } = dep
        changeConfig && changeConfig(dep, form.getFieldsValue())
        changeValue && changeValue(form.getFieldsValue())
      })
    }
  }
  schema.forEach((item) => {
    const { changeConfig, changeValue } = item
    if (changeConfig) {
      item.changeConfig = (...args) => {
        const config = changeConfig(...args)
        if (config)
        // 触发试图更新
          items.current[item.name].update(config)
      }
    }
    if (changeValue) {
      const { mapKeys = [] } = item
      item.changeValue = (...args) => {
        const values = changeValue(...args)
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
  })

  return {
    schema,
    initializeRefs,
    depsExec,
  }
}
