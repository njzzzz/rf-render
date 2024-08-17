import { CanModifyConfig, IRfRenderItem } from '@rf-render/antd'

export type SchemaMap = Record<string, IRfRenderItem>
export type SchemaEffectMap = Record<string, any[]>
export type PreparedIRfRenderItem = Omit<IRfRenderItem, 'initConfig'> & {
  initConfig: CanModifyConfig
}

function deepForEachSchema(
  schema: IRfRenderItem[],
) {
  const preparedSchema: PreparedIRfRenderItem[] = []
  const schemaMap: SchemaMap = {}
  const schemaEffectMap: SchemaEffectMap = {}
  const stack = [...schema]
  let item = stack.shift()
  while (item) {
    const { layout = [], name, dependOn = [] } = item
    // layout 可以没有 name
    if (!name?.length) {
      console.error(`表单项${item} name 字段为必要配置`)
    }
    else {
      // // 初始化提取表单项中的值并更新formData, 这一步提前为了初始化更新deps
      // if (initialValue !== undefined) {
      //   updateFormData(name, initialValue)
      // }
      schemaMap[name!] = item
      // 收集依赖 map
      dependOn.forEach((dep: string) => {
        const deps = schemaEffectMap[dep]
        schemaEffectMap[dep] = deps ? [...deps, name] : [name]
      })
    }
    if (layout) {
      stack.concat(layout)
    }
    item = stack.shift()
  }
  console.log(schemaEffectMap)
  return { schemaMap, schemaEffectMap, preparedSchema }
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
  const { schemaMap, schemaEffectMap, preparedSchema } = deepForEachSchema(schema)
  return {
    schema,
    schemaMap,
    schemaEffectMap,
    preparedSchema,
  }
}
