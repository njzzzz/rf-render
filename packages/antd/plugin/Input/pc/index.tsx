import { defineRfRenderComponentApi } from '@rf-render/antd'
import { Input, InputProps } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi<InputProps>(Input, {
  onChange(e) {
    return [e.target.value]
  },
})
