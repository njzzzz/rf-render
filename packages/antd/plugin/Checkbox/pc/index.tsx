import { defineRfRenderComponentApi } from '@rf-render/antd'
import { Checkbox, CheckboxProps } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi<CheckboxProps>(Checkbox, {
  onChange(e) {
    return e.target.checked
  },
  propsMap: {
    value: 'checked',
  },
})
