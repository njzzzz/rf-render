import { defineRfRenderComponent } from '@rf-render/antd'
import { Radio, RadioChangeEvent } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponent(Radio.Group, {
  onChange(_rfrender, e: RadioChangeEvent) {
    return e.target.value
  },
})
