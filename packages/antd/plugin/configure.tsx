import { WidgetProps } from '@rf-render/antd'
import { defineConfigure } from '@rf-render/core'
import { FormInstance, FormItemProps } from 'antd'

/**
 * common configure
 */
// eslint-disable-next-line react-refresh/only-export-components
export default defineConfigure<keyof WidgetProps, FormInstance>(({ item }) => {
  const { label, widget = '', customerProps = {} } = item
  const prefix = ['AutoComplete', 'Input', 'InputNumber', ''].includes(widget) ? '请输入' : '请选择'
  const placeholder = `${prefix}${label}`
  const { requiredWithRules = false } = customerProps
  const itemProps: FormItemProps = {}
  if (requiredWithRules) {
    itemProps.rules = [{ required: true, message: placeholder }]
  }
  return {
    props: {
      placeholder,
      allowClear: true,
    },
    itemProps,
  }
})

export interface ConfigureProps {
  /**
   * @description 配置 `customerProps.requiredWithRules` 为 true
   * - 将在itemProps.rules中新增一条[{required: true, message: 必填信息，会根据widget类型处理}]
   */
  requiredWithRules?: boolean
}
