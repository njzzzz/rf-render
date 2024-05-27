import '@rf-render/antd'

declare module '@rf-render/antd' {
  // 所有组件的属性
  export interface WidgetProps {
    Component: any
  }
  // 默认组件的属性
  export interface DefaultWidgetProps {
    prop: any
  }
}
