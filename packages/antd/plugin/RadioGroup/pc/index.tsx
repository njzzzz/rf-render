import { defineRfRenderComponentApi } from '@rf-render/antd'
import { Radio, RadioGroupProps } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi<RadioGroupProps>(Radio.Group, {
  onChange(e) {
    return [e.target.value]
  },
})
