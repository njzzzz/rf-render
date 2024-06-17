import { defineRfRenderComponentApi } from '@rf-render/antd'
import { Input } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi(Input, { onChange(_rfrender, e) {
  return e.target.value
} })
