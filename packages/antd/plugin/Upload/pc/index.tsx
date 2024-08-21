import { defineRfRenderComponentApi } from '@rf-render/antd'
import { Button, Upload, UploadProps } from 'antd'
// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponentApi<UploadProps>((props: any) => (
  <Upload {...props}>
    {props.children ? props.children : <Button>上传</Button>}
  </Upload>
), {
  onChange({ fileList = [] }) {
    return [fileList]
  },
  propsMap: {
    value: 'fileList',
  },
})
