import { Context, defineRfRenderComponent } from '@rf-render/antd'
import { useContext } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponent<'Text'>(({ itemConfig }) => {
  const { name, props = {} } = itemConfig
  const { render } = props
  const { form } = useContext(Context)
  const value = form.getFieldValue(name)
  return render ? render(value, form, itemConfig) : value
})
