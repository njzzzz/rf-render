import '@rf-render/react'

declare module '@rf-render/react' {
  // 所有组件的属性
  export interface WidgetProps {
    prop: any
  }
  // 默认组件的属性
  export interface DefaultWidgetProps {
    prop: any
  }
}
