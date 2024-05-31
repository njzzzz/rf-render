import { WidgetProps } from '@rf-render/antd'
import { defineConfigure } from '@rf-render/core'
import { FormInstance } from 'antd'

/**
 * common configure
 */
// eslint-disable-next-line react-refresh/only-export-components
export default defineConfigure<keyof WidgetProps | 'Layout', FormInstance>(({ item }) => {
  const { label, widget = '' } = item
  const prifix = ['AutoComplete', 'Input', 'InputNumber', ''].includes(widget) ? '请输入' : '请选择'
  const placeholder = `${prifix}${label}`

  return {
    props: {
      placeholder,
      allowClear: true,
    },
  }
})

export interface ConfigureProps {
  requiredWithRules?: boolean
}
