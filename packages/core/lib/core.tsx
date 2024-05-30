import React, { SuspenseProps, lazy } from 'react'
import { DepsExec, IRfRenderItem, loader } from '@rf-render/antd'
/**
 * ```ts
 * {
 *     name: 'input',
 *     configure: {
 *       placeholder: 'placeholder'
 *     },
 *     loader: (platform, viewType) => React.lazy(() => import("@/rf-render-components/input/${platform}/${viewType}.tsx"))
 * }
 * ```
 */
export interface Component {
  // TODO: 用于设计器，直接加载或者手动引入用于设计器的设置项，如果不传则直接从platform下引入
  configure?: Configure
  name: string
  loader: Loader
  SuspenseProps?: SuspenseProps
}
export type Loader = (platform: Platform, fileName: FileName) => ReturnType<typeof lazy>
export type CustomLoader = (component: Component) => (props: FormItemBridgeProps) => any
export interface Configure {

}
// eslint-disable-next-line react-refresh/only-export-components
export function definePlugin(plugin: Component[]) {
  return plugin
}
/**
 * 自定义的loader需要实现这两个函数以更新值
 */
export interface FormItemBridgeProps<T = any> {
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  onChange: <T extends any>(...val: T[]) => Promise<any>
  onMapKeysChange: (valueMap: unknown[]) => any
  /**
   * 包含当前表单项的配置项、form实例、执行依赖项函数
   */
  rfrender: {
    depsExec: DepsExec
    form: T
    item: IRfRenderItem
  }
}
export interface Listener {
  reload: boolean
  setReload: React.Dispatch<React.SetStateAction<boolean>>
}
// eslint-disable-next-line ts/ban-types
export type Platform = 'mobile' | 'pc' | string & {}
// 目前
// index表示的是可编辑状态
// view表示的是纯展示状态
// 在切换fileName时会重新加载
// eslint-disable-next-line ts/ban-types
export type FileName = 'index' | 'view' | string & {}
export type Debugger = boolean | 'info' | 'trace'
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
  // 是否启动debugger
  static debugger: Debugger = false
  static listeners = new Set<Listener>()
  static loader: CustomLoader
  /**
   *
   * @param {object} opts
   * @param {boolean} [opts.cover] - 是否直接覆盖重名widget，不建议，默认情况下加载到重名组件时会报错.
   * @param {Array<Component>} [opts.plugins] - 组件插件，重要，用于配置最终渲染使用的组件.
   * @param {string} [opts.defaultWidget] - 默认的widget类型，当为配置widget属性时，会默认使用此配置.
   * @param {CustomLoader} [opts.loader] - 自定义组件loader，默认情况下loader需要实现组件的加载，以及对switchPlatform和switchFileName的响应.
   * @param {boolean} [opts.debugger] - 是否启动debugger，启用将展示哪些依赖变动导致哪些依赖项被执行.
   */
  constructor(opts: { cover?: boolean, plugins?: Component[], defaultWidget?: string, loader?: CustomLoader, debugger?: Debugger }) {
    if (!opts.loader) {
      opts.loader = loader
    }
    RfRender.cover = opts.cover ?? false
    RfRender.debugger = opts.debugger ?? false
    RfRender.plugins = opts.plugins ?? []
    RfRender.defaultWidget = opts.defaultWidget ?? ''
    RfRender.loader = opts.loader!
    RfRender.loadComponents()
  }

  static loadComponents() {
    RfRender.plugins.forEach((component) => {
      if (RfRender.components[component.name] && !RfRender.cover)
        throw new Error(`存在同名组件！请修改组件${component.name} 的name属性值，或设置RfRender cover属性为true，直接覆盖`)

      component.SuspenseProps = component.SuspenseProps || {
        fallback: null,
      }
      RfRender.components[component.name] = component
    })
  }

  static load(componentName: string) {
    const component = RfRender.components[componentName]
    if (!component)
      throw new Error(`未找到widget${componentName}, 请确认是否已配置！`)

    return RfRender.loader(component)
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

  static debug(...args: any[]) {
    if (RfRender.debugger === true || RfRender.debugger === 'info') {
      console.log(...args)
    }
    if (RfRender.debugger === 'trace') {
      console.trace(...args)
    }
  }
}

export default RfRender
