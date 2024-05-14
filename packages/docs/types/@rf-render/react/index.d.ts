import '@rf-render/react'

declare module '@rf-render/react' {
  export interface WidgetProps {
    Test: {
      aa: string
    }
    Test1: {
      bb: string
    }
  }
  export interface DefaultWidgetProps {
    a: string
    b: string
  }
}
