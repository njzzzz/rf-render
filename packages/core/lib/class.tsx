import React, { SuspenseProps, lazy } from 'react'
import { loader } from '@rf-render/core'

/**
 * {
 *     name: 'input',
 *     configure: {
 *       placeholder: 'placeholder'
 *     },
 *     loader: (platform, viewType) => React.lazy(() => import("@/rf-render-components/input/${platform}/${viewType}.tsx"))
 * }
 */
export interface Component {
  // 用于设计器的设置项
  configure?: Configure
  name: string
  loader: (platform: Platform, fileName: FileName) => ReturnType<typeof lazy>
  SuspenseProps?: SuspenseProps
}
export interface Configure {

}
export interface Listener {
  reload: boolean
  setReload: React.Dispatch<React.SetStateAction<boolean>>
}
export type Platform = 'mobile' | 'pc'
// 目前
// index表示的是可编辑状态
// view表示的是纯展示状态
// 在切换fileName时会重新加载
export type FileName = 'index' | 'view'
// 单例
export class RfRender {
  static components: Record<string, Component> = {}
  static fileName: FileName = 'index'
  static platform: Platform = 'pc'
  static plugins: Component[] = []
  // 重名组件是否覆盖
  static cover = false
  // 默认widget
  static defaultWidget = 'Input'
  static listeners = new Set<Listener>()
  constructor(opts: { cover?: boolean, plugins?: Component[], defaultWidget?: string }) {
    RfRender.cover = opts.cover ?? false
    RfRender.plugins = opts.plugins ?? []
    RfRender.defaultWidget = opts.defaultWidget ?? ''
    RfRender.loadComponents()
  }

  static loadComponents() {
    RfRender.plugins.forEach((component) => {
      if (RfRender.components[component.name] && !RfRender.cover)
        throw new Error(`存在同名组件！, 请修改组件${component.name} 的name属性值，或设置RfRender cover属性为true，直接覆盖`)

      component.SuspenseProps = component.SuspenseProps || {
        fallback: <span>error</span>,
      }
      RfRender.components[component.name] = component
    })
  }

  static load(componentName: string) {
    const component = RfRender.components[componentName]
    return loader(component)
  }

  /**
   * 切换文件，重新加载组件
   */
  static switchFileName(fileName: FileName) {
    RfRender.fileName = fileName
    RfRender.runListeners()
  }

  /**
   * 切换平台，重新加载组件
   */
  static switchPlatform(platform: Platform) {
    RfRender.platform = platform
    RfRender.runListeners()
  }

  static addSwitchListener(listener: Listener) {
    RfRender.listeners.add(listener)
  }

  static removeSwitchListener(listener: Listener) {
    RfRender.listeners.delete(listener)
  }

  static runListeners() {
    RfRender.listeners.forEach(({ reload, setReload }) => {
      setReload(!reload)
    })
  }
}

export default RfRender
