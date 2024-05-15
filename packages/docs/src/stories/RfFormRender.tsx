import { FormRenderProps, useFormRender } from '@rf-render/react'
import { RfRender } from '@rf-render/core'

import { Button } from 'antd'

export default function RfFormRender(props: FormRenderProps) {
  const { FormRender, form } = useFormRender()
  return (
    <>
      <FormRender {...props}>
      </FormRender>
      <Button onClick={async () => {
        const value = form.getFieldsValue()
        const valid = await form.validateFields()
        console.log(value, form, valid)
      }}
      >
        showForm
      </Button>
      <Button
        onClick={() => {
          RfRender.switchPlatform('mobile')
        }}
      >
        切换为mobile模式
      </Button>
      <Button
        onClick={() => {
          RfRender.switchPlatform('pc')
        }}
      >
        切换为pc模式
      </Button>
      <Button
        onClick={() => {
          RfRender.switchFileName('view')
        }}
      >
        切换为view文件
      </Button>
      <Button
        onClick={() => {
          RfRender.switchFileName('index')
        }}
      >
        切换为index文件
      </Button>
    </>

  )
}
