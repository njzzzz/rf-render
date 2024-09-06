import { FormModalOpenProps, useFormModal } from '@rf-render/antd'
import { Button } from 'antd'

export default function FormModal(props: FormModalOpenProps) {
  const { FormModal, open } = useFormModal()
  return (
    <div style={{ width: '680px' }}>
      <Button onClick={() => {
        open(props)
      }}
      >
        打开弹框
      </Button>
      <FormModal />
    </div>
  )
}
