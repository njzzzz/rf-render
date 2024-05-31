import { defineRfRenderComponentApi } from '@rf-render/antd'
import { Steps } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi(Steps, { propsMap: {
  value: 'current',
} })
