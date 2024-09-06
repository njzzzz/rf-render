import { Context, defineRfRenderComponent } from '@rf-render/antd'
import { useContext } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponent<'Cascader'>(({ itemConfig }) => {
  const { name, props } = itemConfig
  const { form } = useContext(Context)
  console.log(form.getFieldValue(name), props)
  const values = form.getFieldValue(name) ?? []
  // TODO: 取label展示
  return values.join(' / ')
})
