import { AntdDefaultWidgetProps, AntdWidgetProps } from '@rf-render/antd'

declare module '@rf-render/antd' {
  // 所有组件的属性
  export interface WidgetProps extends AntdWidgetProps {
  }
  // 默认组件的属性
  export interface WidgetDefaultProps extends AntdDefaultWidgetProps {

  }

}
