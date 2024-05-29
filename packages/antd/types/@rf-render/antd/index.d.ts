import { InputProps } from 'antd'
import { CustomerLayout } from '@rf-render/antd'

declare module '@rf-render/antd' {
  // 所有组件的属性
  export interface WidgetProps {
    Layout: CustomerLayout
  }
  // 默认组件的属性
  export interface DefaultWidgetProps extends InputProps {

  }

}
