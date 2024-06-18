import { SuspenseProps, lazy } from 'react'
import { DependOnMaps, IRfRenderItem, MaybePromise, RfRenderItemConf, WidgetProps } from '@rf-render/antd'
/**
 * ```ts
 * {
 *     name: 'input',
 *     configure: {
 *       placeholder: 'placeholder'
 *     },
 *     loader: (platform, viewType) => React.lazy(() => import("@/rf-render-components/input/${platform}/${viewType}.tsx"))
 *     configure: (platform, viewType) =>import("@/rf-render-components/input/${platform}/configure.ts")
 * }
 * ```
 */
export type Component<T extends keyof WidgetProps = keyof WidgetProps, F = any> = {
  [K in keyof WidgetProps]: {
    /**
     * 配置文件加载器
     */
    configure?: ConfigureLoader<T, F>
    /**
     * widget 名称
     */
    name: K
    loader: Loader
    SuspenseProps?: SuspenseProps
  }
}[T]

/**
 * @description 定义默认的configure
 * - 优先级最低，会被用户自定义的覆盖
 * - 只处理第一层属性以及props、itemProps的第一层属性
 */
// eslint-disable-next-line react-refresh/only-export-components
export function defineConfigure<T extends keyof WidgetProps = keyof WidgetProps, F = any>(configure: DefineConfigure<T, F>) {
  return configure
}
type DefineConfigure<T extends keyof WidgetProps = keyof WidgetProps, F = any> = (rfrender: FormItemBridgeProps<F>['rfrender']) => MaybePromise<(Partial<RfRenderItemConf<T>>)>
export type Loader = (platform: Platform, fileName: FileName) => ReturnType<typeof lazy>
export type ConfigureLoader<T extends keyof WidgetProps = keyof WidgetProps, F = any> = (platform: Platform, fileName: FileName) => Promise<({
  default: DefineConfigure<T, F>
})>
export type CustomLoader = (component: Component) => (props: FormItemBridgeProps) => any

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
    dependOnMaps: DependOnMaps
    form: T
    item: IRfRenderItem
    formName: symbol
    immediateDeps: boolean
  }
}
export type Listener = (...args: unknown[]) => unknown
// eslint-disable-next-line ts/ban-types
export type Platform = 'mobile' | 'pc' | string & {}
// 目前
// index表示的是可编辑状态
// view表示的是纯展示状态
// 在切换fileName时会重新加载
// eslint-disable-next-line ts/ban-types
export type FileName = 'index' | 'view' | string & {}
export type Debugger = boolean | 'info' | 'trace'
export type DefaultWidget = keyof WidgetProps
export type RfRenderFormName = symbol
export type RfRenderDeps = Map<RfRenderFormName, RfRenderDep>
export interface RfRenderDepEntity { changeConfig: () => any, changeValue: () => any }
export type RfRenderDep = Map<string, RfRenderDepEntity>
// 单例
export class RfRender {
  static components: Partial<Record<keyof WidgetProps, Component> > = {}
  static fileName: FileName = 'index'
  static platform: Platform = 'pc'
  static plugins: Component[] = []
  // 重名组件是否覆盖
  static cover = false
  // 默认widget
  static defaultWidget: DefaultWidget = 'Input'
  // 是否启动debugger
  static debugger: Debugger = false
  // 监听器，用于更新组件和配置
  static listeners = new Set<Listener>()
  // 表单字段收集器
  static deps: RfRenderDeps = new Map()
  /**
   *
   * @param {object} opts
   * @param {boolean} [opts.cover] - 是否直接覆盖重名widget，不建议，默认情况下加载到重名组件时会报错.
   * @param {Array<Component>} [opts.plugins] - 组件插件，重要，用于配置最终渲染使用的组件.
   * @param {string} [opts.defaultWidget] - 默认的widget类型，当为配置widget属性时，会默认使用此配置.
   * @param {CustomLoader} [opts.loader] - 自定义组件loader，默认情况下loader需要实现组件的加载，以及对switchPlatform和switchFileName的响应.
   * @param {boolean} [opts.debugger] - 是否启动debugger，启用将展示哪些依赖变动导致哪些依赖项被执行.
   */
  constructor(opts: { cover?: boolean, plugins?: Component[], defaultWidget?: DefaultWidget, loader?: CustomLoader, debugger?: Debugger }) {
    RfRender.cover = opts.cover ?? false
    RfRender.debugger = opts.debugger ?? false
    RfRender.plugins = opts.plugins ?? []
    RfRender.defaultWidget = opts.defaultWidget ?? 'Input'
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

  static load(widget: keyof WidgetProps = RfRender.defaultWidget) {
    const component = RfRender.components[widget]
    if (!component)
      throw new Error(`未找到widget 【${widget}】, 请确认是否已配置！`)
    if (!component.loader) {
      throw new Error(`未找到widget 【${widget}】对应的loader, 请确认是否已配置！`)
    }
    return component.loader(RfRender.platform, RfRender.fileName)
  }

  static loadConfigure<T extends keyof WidgetProps>(widget: T): ReturnType<ConfigureLoader> | undefined {
    const component = RfRender.components[widget]
    if (!component)
      return
    const configureLoader = component.configure
    if (configureLoader) {
      return configureLoader(RfRender.platform, RfRender.fileName)
    }
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
    RfRender.listeners.forEach(listener => listener())
  }

  static addDep(formName: RfRenderFormName, name: string, dep: RfRenderDepEntity) {
    const formDeps = RfRender.deps.get(formName)
    if (!formDeps) {
      RfRender.deps.set(formName, new Map().set(name, dep))
    }
    else {
      formDeps.set(name, dep)
    }
  }

  static removeDep(formName: RfRenderFormName, name: string) {
    const formDeps = RfRender.deps.get(formName)
    if (formDeps) {
      formDeps.delete(name)
    }
  }

  static getDep(formName: RfRenderFormName, name: string) {
    const formDeps = RfRender.deps.get(formName)
    if (formDeps) {
      return formDeps.get(name)
    }
  }

  static getAllDeps(formName: RfRenderFormName) {
    const formDeps = RfRender.deps.get(formName)
    if (formDeps) {
      return Array.from(formDeps.values())
    }
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
