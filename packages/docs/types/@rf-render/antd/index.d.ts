import '@rf-render/antd'
import { AntdDefaultWidgetProps, AntdWidgetProps } from '@rf-render/antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'

declare module '@rf-render/antd' {
  // 所有组件的属性
  export interface WidgetProps extends AntdWidgetProps {
    CheckboxGroup: CheckboxGroupProps
  }
  // 默认组件的属性
  export interface DefaultWidgetProps extends AntdDefaultWidgetProps {

  }
}
