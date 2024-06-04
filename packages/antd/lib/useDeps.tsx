import { IRfRenderItem } from '@rf-render/antd'
import { useMemo } from 'react'

export function useDeps(schema: IRfRenderItem[]) {
  function genDependOnMaps(schema: IRfRenderItem[], deps: Record<string, IRfRenderItem[]> = {}, maps: Record<string, IRfRenderItem> = {}) {
    schema.forEach((item) => {
      const { dependOn = [], layout = [], name } = item
      if (name) {
        maps[name] = item
      }
      dependOn.forEach((dep) => {
        deps[dep] = deps[dep] ? [...deps[dep], item] : [item]
      })
      // 递归处理layout
      if (layout.length) {
        genDependOnMaps(layout, deps, maps)
      }
    })
    return {
      deps,
      maps,
    }
  }

  const dependOnMaps = useMemo(() => {
    return genDependOnMaps(schema)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema])
  return {
    dependOnMaps,
  }
}
// export type DepsExec = ReturnType<typeof useDeps>['dependOnMaps']

export interface DependOnMaps {
  deps: Record<string, IRfRenderItem[]>
  maps: Record<string, IRfRenderItem>
}
