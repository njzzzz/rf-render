import '@rf-render/antd'
import { AntdDefaultWidgetProps, AntdWidgetProps, ConfigureProps } from '@rf-render/antd'

declare module '@rf-render/antd' {
  // 所有组件的属性
  export interface WidgetProps extends AntdWidgetProps {
  }
  // 默认组件的属性
  export interface DefaultWidgetProps extends AntdDefaultWidgetProps {

  }
  // 自定义拓展类型
  export interface CustomerProps extends ConfigureProps {}
}
