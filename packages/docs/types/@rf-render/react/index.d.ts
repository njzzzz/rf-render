import '@rf-render/antd'
import { InputProps } from 'antd'

declare module '@rf-render/antd' {
  // 所有组件的属性
  export interface WidgetProps {
    Test: {
      aa: string
    }
    Test1: {
      bb: string
    }
  }
  // 默认组件的属性
  export interface DefaultWidgetProps extends InputProps {

  }
}
