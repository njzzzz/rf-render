import { ComponentType, SuspenseProps } from 'react'
import {
  IRfRenderItem,
  MaybePromise,
  WidgetProps,
} from '@rf-render/antd'
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
export type Component<
  T extends keyof WidgetProps = keyof WidgetProps,
> = {
  [K in keyof WidgetProps]: {
    /**
     * 配置文件加载器
     */
    configure?: ConfigureLoader
    /**
     * widget 名称
     */
    name: K
    loader: Loader
    SuspenseProps?: SuspenseProps
  };
}[T]

/**
 * @description 定义默认的configure
 * - 优先级最低，会被用户自定义的覆盖
 * - 只处理第一层属性以及props、itemProps的第一层属性
 */
// eslint-disable-next-line react-refresh/only-export-components
export function defineConfigure<Widget extends keyof WidgetProps = DefaultWidget>(configure: DefineConfigure<Widget>) {
  return configure
}
type DefineConfigure<Widget extends keyof WidgetProps = DefaultWidget> = (
  props: { itemConfig: Omit<IRfRenderItem, 'props'> & {
    props?: WidgetProps[Widget]
  } }
) => MaybePromise<Partial<IRfRenderItem>>
export type Loader = (
  platform: Platform,
  fileName: FileName,
) => ComponentType<any>
export type ConfigureLoader = (
  platform: Platform,
  fileName: FileName,
) => Promise<{
  default: DefineConfigure
}>
export type CustomLoader = (
  component: Component
) => (props: FormItemBridgeProps) => any

// eslint-disable-next-line react-refresh/only-export-components
export function definePlugin(plugin: Component[]) {
  return plugin
}
export type WidgetItemConfig<Widget extends keyof WidgetProps = DefaultWidget> = Omit<IRfRenderItem, 'props'> & {
  props?: WidgetProps[Widget]
}
/**
 * 自定义的loader需要实现这两个函数以更新值
 */
export interface FormItemBridgeProps<Widget extends keyof WidgetProps = DefaultWidget> {
  itemConfig: WidgetItemConfig<Widget>
  /**
   * @description 更新value 和 mapKeys value
   */
  onChange: (val: unknown[]) => any
}
export type Listener = (...args: unknown[]) => unknown
// eslint-disable-next-line ts/ban-types
export type Platform = 'mobile' | 'pc' | (string & {})
// 目前
// index表示的是可编辑状态
// view表示的是纯展示状态
// 在切换fileName时会重新加载
// eslint-disable-next-line ts/ban-types
export type FileName = 'index' | 'view' | (string & {})
export type Debugger = boolean | 'info' | 'trace'
export type DefaultWidget = keyof WidgetProps
export type RfRenderFormName = symbol
export type RfRenderDeps = Map<RfRenderFormName, RfRenderDep>
export type RfRenderOneDeps = Map<RfRenderFormName, RfRenderOneDep>
export interface RfRenderDepEntity {
  changeConfig: () => any
  changeValue: () => any
}

export interface RfRenderOneDepEntity {
  changeConfigs: Set<() => any>
  changeValues: Set<() => any>
}

export type RfRenderDep = Map<string, RfRenderDepEntity>
export type RfRenderOneDep = Map<string, RfRenderOneDepEntity>
// 单例
export class RfRender {
  static components: Partial<Record<keyof WidgetProps, Component>> = {}
  static fileName: Map<RfRenderFormName, FileName> = new Map()
  static platform: Map<RfRenderFormName, Platform> = new Map()
  static plugins: Component[] = []
  // 重名组件是否覆盖
  static cover = false
  // 默认widget
  static defaultWidget: DefaultWidget = 'Input'
  // 是否启动debugger
  static debugger: Debugger = false
  // 监听器，用于更新组件和配置
  static listeners: Map<RfRenderFormName, Set<Listener>> = new Map()
  // 表单字段收集器 -- 字符串类型
  static deps: RfRenderDeps = new Map()
  // 表单字段收集器 -- 对象类型
  static oneDeps: RfRenderOneDeps = new Map()
  /**
   *
   * @param {object} opts
   * @param {boolean} [opts.cover] - 是否直接覆盖重名widget，不建议，默认情况下加载到重名组件时会报错.
   * @param {Array<Component>} [opts.plugins] - 组件插件，重要，用于配置最终渲染使用的组件.
   * @param {string} [opts.defaultWidget] - 默认的widget类型，当为配置widget属性时，会默认使用此配置.
   * @param {CustomLoader} [opts.loader] - 自定义组件loader，默认情况下loader需要实现组件的加载，以及对switchPlatform和switchFileName的响应.
   * @param {boolean} [opts.debugger] - 是否启动debugger，启用将展示哪些依赖变动导致哪些依赖项被执行.
   */
  constructor(opts: {
    cover?: boolean
    plugins?: Component[]
    defaultWidget?: DefaultWidget
    loader?: CustomLoader
    debugger?: Debugger
  }) {
    RfRender.cover = opts.cover ?? false
    RfRender.debugger = opts.debugger ?? false
    RfRender.plugins = opts.plugins ?? []
    RfRender.defaultWidget = opts.defaultWidget ?? 'Input'
    RfRender.loadComponents()
  }

  static loadComponents() {
    RfRender.plugins.forEach((component) => {
      if (RfRender.components[component.name] && !RfRender.cover)
        throw new Error(
          `存在同名组件！请修改组件${component.name} 的name属性值，或设置RfRender cover属性为true，直接覆盖`,
        )

      component.SuspenseProps = component.SuspenseProps || {
        fallback: null,
      }
      RfRender.components[component.name] = component
    })
  }

  static load(widget: keyof WidgetProps = RfRender.defaultWidget, formName: RfRenderFormName, platform?: Platform, fileName?: FileName) {
    const component = RfRender.components[widget]
    if (!component)
      throw new Error(`未找到widget 【${widget}】, 请确认是否已配置！`)
    if (!component.loader) {
      throw new Error(
        `未找到widget 【${widget}】对应的loader, 请确认是否已配置！`,
      )
    }
    const _platform = platform || RfRender.platform.get(formName) || 'pc'
    const _fileName = fileName || RfRender.fileName.get(formName) || 'index'
    return component.loader(_platform, _fileName)
  }

  static loadConfigure<T extends keyof WidgetProps>(
    widget: T,
    formName: RfRenderFormName,
    platform?: Platform,
    fileName?: FileName,
  ): ReturnType<ConfigureLoader> | undefined {
    const component = RfRender.components[widget]
    if (!component)
      return
    const configureLoader = component.configure
    if (configureLoader) {
      const _platform = platform || RfRender.platform.get(formName) || 'pc'
      const _fileName = fileName || RfRender.fileName.get(formName) || 'index'
      return configureLoader(_platform, _fileName)
    }
  }

  /**
   * 同时切换文件和平台，重新加载组件
   */
  static switchPlatformAndFileName(platform: Platform, fileName: FileName, formName: RfRenderFormName) {
    RfRender.fileName.set(formName, fileName)
    RfRender.platform.set(formName, platform)
    RfRender.runListeners(formName)
  }

  /**
   * 切换文件，重新加载组件
   */
  static switchFileName(fileName: FileName, formName: RfRenderFormName) {
    RfRender.fileName.set(formName, fileName)
    RfRender.runListeners(formName)
  }

  /**
   * 切换平台，重新加载组件
   */
  static switchPlatform(platform: Platform, formName: RfRenderFormName) {
    RfRender.platform.set(formName, platform)
    RfRender.runListeners(formName)
  }

  static addSwitchListener(formName: RfRenderFormName, listener: Listener) {
    const set = RfRender.listeners.get(formName) ?? new Set()
    set.add(listener)
    RfRender.listeners.set(formName, set)
  }

  static removeSwitchListener(formName: RfRenderFormName, listener: Listener) {
    const set = RfRender.listeners.get(formName) ?? new Set()
    set.delete(listener)
  }

  static runListeners(formName: RfRenderFormName) {
    if (formName) {
      const set = RfRender.listeners.get(formName) ?? new Set()
      set.forEach(listener => listener())
    }
    else {
      RfRender.listeners.forEach((set) => {
        set.forEach(listener => listener())
      })
    }
  }

  static addDep(
    formName: RfRenderFormName,
    name: string,
    dep: RfRenderDepEntity,
  ) {
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

  static removeAllDep(formName: RfRenderFormName) {
    const formDeps = RfRender.deps.get(formName)
    formDeps?.clear()
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

  static addOneDep(
    formName: RfRenderFormName,
    name: string,
    dep: RfRenderOneDepEntity,
  ) {
    const defaultNameDeps = new Map()
    let formDeps = RfRender.oneDeps.get(formName)
    if (!formDeps) {
      RfRender.oneDeps.set(formName, defaultNameDeps)
      formDeps = defaultNameDeps
    }
    // const defaultEntityDeps = new .set(name, { changeConfigs: new Set(), changeValues: new Set() })
    const { changeConfigs: changeConfigsTodo, changeValues: changeValuesTodo } = dep
    const recordDep = formDeps.get(name)
    if (recordDep) {
      const { changeConfigs, changeValues } = formDeps.get(name)!
      changeConfigsTodo.forEach((cC) => {
        changeConfigs.add(cC)
      })
      changeValuesTodo.forEach((cV) => {
        changeValues.add(cV)
      })
    }
    else {
      formDeps.set(name, {
        changeConfigs: changeConfigsTodo,
        changeValues: changeValuesTodo,
      })
    }
  }

  static removeOneDep(formName: RfRenderFormName, name: string) {
    const formDeps = RfRender.oneDeps.get(formName)
    if (formDeps) {
      formDeps.delete(name)
    }
  }

  static removeAllOneDep(formName: RfRenderFormName) {
    const formDeps = RfRender.oneDeps.get(formName)
    formDeps?.clear()
  }

  static getOneDep(formName: RfRenderFormName, name: string) {
    const formDeps = RfRender.oneDeps.get(formName)
    if (formDeps) {
      return formDeps.get(name)
    }
  }

  static getAllOneDeps(formName: RfRenderFormName) {
    const formDeps = RfRender.oneDeps.get(formName)
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
