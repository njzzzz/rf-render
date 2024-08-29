import { GetPropsType, defineRfRenderComponentApi } from '@rf-render/antd'
import { Input } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi<GetPropsType<typeof Input.TextArea>>(Input.TextArea, {
  onChange(e) {
    return [e.target.value]
  },
})
