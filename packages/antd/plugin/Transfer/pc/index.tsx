import { Context, DNCV, defineRfRenderComponent } from '@rf-render/antd'
import { Transfer } from 'antd'
import { useContext } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponent<'Transfer'>((props) => {
  const { onChange, itemConfig } = props
  const { form } = useContext(Context)
  const { mapKeys = [], name, props: compProps } = itemConfig
  const [selectedMapKey] = mapKeys
  /**
   * 使用targetSelectedKeys作为值
   */
  return (
    <Transfer
      {...compProps}
      targetKeys={form.getFieldValue(name)}
      selectedKeys={form.getFieldValue(selectedMapKey)}
      onChange={(val) => {
        onChange([val, DNCV])
      }}
      onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
        if (selectedMapKey) {
        /**
         * 使用mapKeys第0项储存已选中的值，这里更新表单值
         */
          onChange([DNCV, [...sourceSelectedKeys, ...targetSelectedKeys]])
          /**
           * 这里刷新界面
           */
        }
      }}
    >
    </Transfer>
  )
})
