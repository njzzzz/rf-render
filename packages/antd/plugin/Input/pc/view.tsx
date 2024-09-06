import { Context, defineRfRenderComponent } from '@rf-render/antd'
import { useContext } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponent<'Input'>(({ itemConfig }) => {
  const { name } = itemConfig
  const { form } = useContext(Context)
  return form.getFieldValue(name)
})
