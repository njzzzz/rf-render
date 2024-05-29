import { IRfRenderItem } from '@rf-render/antd'
import { ButtonProps, ColProps, FormInstance, InputProps, RowProps } from 'antd'

export interface CustomerLayout {
  /**
   * 一行展示几个
   */
  span?: number
  rowProps?: RowProps
  colProps?: ColProps
  onFieldValueChange?: (config: IRfRenderItem, formData: any, form: FormInstance) => any
}

/**
 * 用于widget类型推断,使用本预制插件需要引入此类型
 */
export interface AntdWidgetProps {
  Layout: CustomerLayout
  Button: ButtonProps
}
export interface AntdDefaultWidgetProps extends InputProps {

}
