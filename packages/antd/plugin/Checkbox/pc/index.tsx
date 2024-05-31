import { defineRfRenderComponentApi } from '@rf-render/antd'
import { Checkbox } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi(Checkbox, {
  onChange(_rfrender, e: { target: { checked: boolean } }) {
    return e.target.checked
  },
  propsMap: {
    value: 'checked',
  },
})
