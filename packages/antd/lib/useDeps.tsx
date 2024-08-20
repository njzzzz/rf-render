import { CanModifyConfig, IRfRenderItem } from '@rf-render/antd'

export type SchemaMap = Record<string, IRfRenderItem>
export type SchemaEffectMap = Record<string, string[]>
export type SchemaEffectRecordMap = Record<string, string[]>
export type PreparedIRfRenderItem = Omit<IRfRenderItem, 'initConfig'> & {
  initConfig: CanModifyConfig
}

function deepForEachSchema(
  schema: IRfRenderItem[],
) {
  const preparedSchema: PreparedIRfRenderItem[] = []
  const schemaMap: SchemaMap = {}
  // 收集依赖执行changeConfig和changeValue --> 针对数组中的字符串类型
  const dependOnMap: SchemaEffectMap = {}
  // 收集依赖执行changeConfig和changeValue --> 针对数组中的对象类型，单独执行
  const independentOnsMap: SchemaEffectRecordMap = {}
  const stack = [...schema]
  let item = stack.shift()
  while (item) {
    const { layout = [], name, dependOn = [], independentOn = [] } = item
    // layout 可以没有 name
    if (!name?.length) {
      console.error(`表单项${item} name 字段为必要配置`)
    }
    else {
      schemaMap[name!] = item
      // 收集dependOn依赖 map
      dependOn.forEach((dep) => {
        const deps = dependOnMap[dep]
        dependOnMap[dep] = deps
          ? [
              ...deps,
              name,
            ]
          : [name]
      })
      // 收集independentOn依赖 map
      independentOn.forEach(({ dependOn = [] }) => {
        dependOn.forEach((independentOnName) => {
          const deps = independentOnsMap[independentOnName]
          independentOnsMap[independentOnName] = deps ? [...deps, independentOnName] : [independentOnName]
        })
      })
    }
    if (layout) {
      stack.concat(layout)
    }
    item = stack.shift()
  }
  return { schemaMap, dependOnMap, preparedSchema, independentOnsMap }
}

export interface UsePrepareSchema {
  schema: IRfRenderItem[]
  formName: symbol
}
/**
 * @description 准备schema数据
 */
export function usePrepareSchema(props: UsePrepareSchema) {
  const { schema } = props
  const { schemaMap, dependOnMap, preparedSchema, independentOnsMap } = deepForEachSchema(schema)
  return {
    schema,
    schemaMap,
    dependOnMap,
    preparedSchema,
    independentOnsMap,
  }
}
