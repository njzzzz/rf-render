import { Form, FormInstance, FormItemProps, FormProps } from 'antd'
import * as React from 'react'
import { ReactNode, RefAttributes } from 'react'
import { RfRender } from '@rf-render/core'
import IntrinsicAttributes = React.JSX.IntrinsicAttributes

export type TFormProps = IntrinsicAttributes & FormProps & { children?: ReactNode } & RefAttributes<FormInstance<any>>
export interface IRfRenderItem<T = any> {
  name: string
  widget?: string
  props?: T
  label?: ReactNode
  ItemProps?: FormItemProps
}
interface IProps<T = any> {
  schema: IRfRenderItem<T>[]
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
