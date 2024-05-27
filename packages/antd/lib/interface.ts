import { FormInstance, FormItemProps, FormProps } from 'antd'
import { ReactNode, RefAttributes } from 'react'
import IntrinsicAttributes = JSX.IntrinsicAttributes

export type TFormProps = IntrinsicAttributes & FormProps & { children?: ReactNode } & RefAttributes<FormInstance<any>>

// 定义 WidgetProps 类型, 供外部拓展{ name: propsType }形式
export interface WidgetProps {

}
// 默认widget的props类型，需要用户在外部配置
export interface DefaultWidgetProps {

}
export type MaybePromise<T> = T | Promise<T>
// 可被dependOn修改的属性,name不可修改，暂不开放修改widget
export type CanModifyConfigKeys = 'label' | 'itemProps' | 'props'
export type CanModifyConfig = Partial<Pick<IRfRenderItem, CanModifyConfigKeys>>
export interface CommonRfRenderItemConf<T extends string> {
  name: T
  label?: ReactNode
  ItemProps?: FormItemProps
  // 可以自定义其他键名，只要在组件里抛出即可
  mapKeys?: string[]
  dependOn?: T[]

}
export interface ChangedConfig<T extends string, P> extends CommonRfRenderItemConf<T> {
  props?: P
}
export interface DefaultRfRenderItemConf<T extends string> extends CommonRfRenderItemConf<T> {
  widget?: undefined
  props?: DefaultWidgetProps
  changeConfig?: (config: ChangedConfig<T, DefaultWidgetProps>, formData: { [K in T]: any } & Record<string, any>) => MaybePromise<CanModifyConfig | void>
  changeValue?: (formData: { [K in T]: any } & Record<string, any>) => MaybePromise<void | any[]>
}

export interface RfRenderItemConf<W extends keyof WidgetProps, T extends string> extends CommonRfRenderItemConf<T> {
  widget: W
  props?: WidgetProps[W]
  changeConfig?: (config: ChangedConfig<T, WidgetProps[W]>, formData: { [K in T]: any } & Record<string, any>) => MaybePromise<CanModifyConfig | void>
  changeValue?: (formData: { [K in T]: any } & Record<string, any>) => MaybePromise<void | any[]>
}

// 使用联合类型生成所有可能的组合
export type IRfRenderItem<T extends string = string> = {
  [K in keyof WidgetProps]: RfRenderItemConf<K, T> | DefaultRfRenderItemConf<T>
}[keyof WidgetProps]

export interface IProps {
  schema: IRfRenderItem[]
}
export type FormRenderProps = TFormProps & IProps
// 收束name
export function defineSchema<T extends string = string>(schema: IRfRenderItem<T>[]) {
  return schema
}

export const DNCV = Symbol('do_not_change_value')
