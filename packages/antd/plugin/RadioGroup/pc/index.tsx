import { defineRfRenderComponentApi } from '@rf-render/antd'
import { Radio } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi(Radio.Group, {
  onChange(e) {
    return e.target.value
  },
})
