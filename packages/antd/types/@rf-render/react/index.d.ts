import '@rf-render/antd'

declare module '@rf-render/antd' {
  // 所有组件的属性
  export interface WidgetProps {
    prop: any
  }
  // 默认组件的属性
  export interface DefaultWidgetProps {
    prop: any
  }
}
