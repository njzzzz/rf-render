import '@rf-render/react'

declare module '@rf-render/react' {
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
  export interface DefaultWidgetProps {
    a: string
    b: string
  }
}