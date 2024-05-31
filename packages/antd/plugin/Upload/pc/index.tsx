import { defineRfRenderComponentApi } from '@rf-render/antd'
import { Button, Upload } from 'antd'
// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi((props: any) => (
  <Upload {...props}>
    {props.children ? props.children : <Button>上传</Button>}
  </Upload>
), {
  onChange(_rfrender, { fileList = [] }) {
    return fileList
  },
  propsMap: {
    value: 'fileList',
  },
})
