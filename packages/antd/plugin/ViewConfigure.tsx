import { WidgetProps } from '@rf-render/antd'
import { defineConfigure } from '@rf-render/core'
import { FormInstance } from 'antd'

/**
 * common configure
 */
// eslint-disable-next-line react-refresh/only-export-components
export default defineConfigure<keyof WidgetProps, FormInstance>(() => {
  return {
    props: {
      disabled: true,
      readOnly: true,
    },
  }
})
