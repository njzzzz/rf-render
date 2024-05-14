import { Form, FormInstance, FormItemProps, FormProps } from 'antd'
import * as React from 'react'
import { ReactNode, RefAttributes } from 'react'
import { RfRender } from '@rf-render/core'
import IntrinsicAttributes = React.JSX.IntrinsicAttributes

export type TFormProps = IntrinsicAttributes & FormProps & { children?: ReactNode } & RefAttributes<FormInstance<any>>

// 定义 WidgetProps 类型, 供外部拓展{ name: propsType }形式
export interface WidgetProps {

}
// 默认widget的props类型，需要用户在外部配置
export interface DefaultWidgetProps {
}

export interface CommonRfRenderItemConf {
  name: string
  label?: ReactNode
  ItemProps?: FormItemProps
  dependOn?: any
  changeConfig?: any
  changeValue?: any
}

export interface DefaultRfRenderItemConf extends CommonRfRenderItemConf {
  widget?: undefined
  props?: DefaultWidgetProps
}

export interface RfRenderItemConf<W extends keyof WidgetProps> extends CommonRfRenderItemConf {
  widget: W
  props?: WidgetProps[W]
}

// 使用联合类型生成所有可能的组合
export type IRfRenderItem = {
  [K in keyof WidgetProps ]: RfRenderItemConf<K> | DefaultRfRenderItemConf
}[keyof WidgetProps]

interface IProps {
  schema: IRfRenderItem[]
}

export type FormRenderProps = TFormProps & IProps
export function useFormRender() {
  const [form] = Form.useForm()
  const FormRender = (props: FormRenderProps) => {
    const { schema, ...antdFromProps } = props
    return (
      <Form form={form} {...antdFromProps}>
        {
        schema.map((item) => {
          const { name, ItemProps = {}, widget = RfRender.defaultWidget, props = {}, label } = item
          return (
            <Form.Item key={name} name={name} label={label} {...ItemProps}>
              {/* 加载组件，并传入属性 */}
              {RfRender.load(widget)(props)}
            </Form.Item>
          )
        })
      }
      </Form>
    )
  }
  return {
    FormRender,
    form,
  }
}
