import { ColProps, FormInstance, FormItemProps, FormProps } from 'antd'
import { ReactNode, RefAttributes } from 'react'
import IntrinsicAttributes = JSX.IntrinsicAttributes

export type TFormProps = IntrinsicAttributes & FormProps & { children?: ReactNode } & RefAttributes<FormInstance<any>>

/**
 * @description 定义 WidgetProps 类型, 供外部拓展 { widget: widgetPropsType } 形式
 * @example
 *
 * 比如我自定义了一个组件 Example 其属性类型为
 * ```ts
 * interface IExampleProps {
 *  props: string
 * }
 * ```
 * 现在需要拓展widget
 * - 那么可以在拓展的时候定义WidgetProps
 * ```ts
 * interface WidgetProps {
 *  Example: IExampleProps
 * }
 * ```
 * - 这样在定义widget时就会多出一个Example类型，同时props的类型即为IExampleProps
 */
export interface WidgetProps {

}
/**
 * @description 默认widget的props类型，需要用户在外部配置
 * - 意思就是不配置widget的时候，props的类型
 * - defaultWidget的配置，可以在new RfRender时传入
 */
export interface DefaultWidgetProps {

}
/**
 * 用于拓展自定义属性类型
 */
export interface CustomerProps {

}
export type MaybePromise<T> = T | Promise<T>
// 可被dependOn修改的属性,name不可修改，暂不开放修改widget
export type CanModifyConfigKeys = 'label' | 'itemProps' | 'props' | 'display' | 'visibility'
export type CanModifyConfig = Partial<Pick<IRfRenderItem, CanModifyConfigKeys>>
export interface CommonRfRenderItemConf<T extends string = string> {
  /**
   * @description 字段名
   */
  name?: T
  /**
   * @description 表单label
   */
  label?: ReactNode
  /**
   * 是否显示，false时会隐藏组件，值会被保留
   */
  visibility?: boolean
  /**
   * 是否显示,false时组件会被卸载，值不会被保留
   */
  display?: boolean
  /**
   * @description antd Form.Item的属性配置
   */
  itemProps?: FormItemProps
  /**
   * @description 可以自定义其他键名，只要在组件里抛出即可
   * @example
   * 比如当前项的配置为, CustomerSelect为你自定义的插件
   * ```js
   * {
   *   name: 'prop',
   *   label: '展示的label'
   *   widget: 'CustomerSelect',
   *   mapKeys: ['selectedItem']
   * }
   * ```
   *  - 默认情况下表单字段只会包含prop不会包含selectedItem
   *  - 如果想让mapKeys生效，需要在CustomerSelect组件中 调用props.onMapKeysChange时间抛出一个数组，数组的值和mapKeys配置一一对应
   *  - 这样在表单字段中就会产生selectedItem字段，值为你抛出的值
   *  - 常用场景为Select返回的是id但是你又需要Select选中对象中的值，就可以使用mapKeys抛出
   */
  mapKeys?: Array<T>
  /**
   * @description 当前表单的依赖项，
   * - 当依赖项的值发生变动时会执行当前配置的changeConfig和changeValue函数以修改当前项的值或者配置
   */
  dependOn?: Array<T>
  /**
   * @description 是否使用Form.Item包裹
   * - 设为false不会使用Form.Item包裹
   * - ItemProps以及和antd Form.Item相关功能都会失效
   * @default true
   */
  withFormItem?: boolean
  /**
   * @description 布局组件使用，传入layout的子项也会参与dependOn
   */
  layout?: Array<IRfRenderItem<T> & {
    /**
     * @description 如果没有使用内置的antd插件，则需要自己实现这个属性的效果
     * - widget为Layout，其layout下的子组件可配
     */
    colProps?: ColProps
  }>
  /**
   * @description 拓展属性，用于拓展属性和类型
   */
  customerProps?: CustomerProps
}
export interface ChangedConfig<T extends string, P> extends CommonRfRenderItemConf<T> {
  props?: P
}
export interface DefaultRfRenderItemConf<T extends string = string> extends CommonRfRenderItemConf<T> {
  widget?: undefined
  /**
   * 当前widget对应的组件的属性
   */
  props?: DefaultWidgetProps
  /**
   * @description 当dependOn中依赖的表单项值发生变化时会执行
   * - 可修改配置后返回
   * - 只支持修改 'label' | 'itemProps' | 'props' | 'display' | 'visibility' 这5个属性
   */
  changeConfig?: (config: ChangedConfig<T, DefaultWidgetProps>, formData: { [K in T]: any } & Record<string, any>) => MaybePromise<CanModifyConfig>
  /**
   * @description 当dependOn中依赖的表单项值发生变化时会执行
   * - 可修改值后返回数组 [第一项修改的是当前表单项name字段的值, 后面修改的是mapKeys中定义的值]
   * - 如果某项的值不需要被修改请返回DNCV标识 [DNCV, DNCV]
   * ```ts
   * import {DNCV} from "@rf-render/antd"
   * ```
   */
  changeValue?: (formData: { [K in T]: any } & Record<string, any>) => MaybePromise<any[]>
  /**
   * @description 初始化config，常用于异步配置一些属性
   */
  initConfig?: (config: ChangedConfig<T, DefaultWidgetProps>) => MaybePromise<CanModifyConfig>
}

export interface RfRenderItemConf<W extends keyof WidgetProps = keyof WidgetProps, T extends string = string> extends CommonRfRenderItemConf<T> {
  widget: W
  /**
   * 当前widget对应的组件的属性
   */
  props?: WidgetProps[W]
  /**
   * @description 当dependOn中依赖的表单项值发生变化时会执行
   * - 可修改配置后返回
   * - 只支持修改 'label' | 'itemProps' | 'props' | 'display' | 'visibility' 这5个属性
   */
  changeConfig?: (config: ChangedConfig<T, WidgetProps[W]>, formData: { [K in T]: any } & Record<string, any>) => MaybePromise<CanModifyConfig>
  /**
   * @description 当dependOn中依赖的表单项值发生变化时会执行
   * - 可修改值后返回数组 [第一项修改的是当前表单项name字段的值, 后面修改的是mapKeys中定义的值]
   * - 如果某项的值不需要被修改请返回DNCV标识 [DNCV, DNCV]
   * ```ts
   * import {DNCV} from "@rf-render/antd"
   * ```
   */
  changeValue?: (formData: { [K in T]: any } & Record<string, any>) => MaybePromise<any[]>
  /**
   * @description 初始化config，常用于异步配置一些属性
   */
  initConfig?: (config: ChangedConfig<T, WidgetProps[W]>) => MaybePromise<CanModifyConfig>
}

// 使用联合类型生成所有可能的组合
export type IRfRenderItem<T extends string = string> = {
  [K in keyof WidgetProps]: RfRenderItemConf<K, T> | DefaultRfRenderItemConf<T>
}[keyof WidgetProps]

export interface IProps {
  schema: IRfRenderItem[]
}
export type FormRenderProps = TFormProps & IProps

/**
 * @description 定义表单schema，使用此函数可以获得更好的类型提示
 */
export function defineSchema<T extends string = string>(schema: IRfRenderItem<T>[]) {
  return schema
}

export const DNCV = Symbol('do_not_change_value')
