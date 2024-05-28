import '@rf-render/antd'
import { InputProps } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import { CustomerLayout } from '../../../src/RfRenderComponents/Layout/pc'

declare module '@rf-render/antd' {
  // 所有组件的属性
  export interface WidgetProps {
    Test: {
      aa: string
    }
    Test1: {
      bb: string
    }
    CheckboxGroup: CheckboxGroupProps
    Layout: CustomerLayout
  }
  // 默认组件的属性
  export interface DefaultWidgetProps extends InputProps {

  }
}
