import { defineRfRenderComponentApi } from '@rf-render/antd'
import { InputNumber } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi(props => <InputNumber style={{ width: '100%' }} {...props}></InputNumber>)
