import { DNCV, defineRfRenderComponent } from '@rf-render/antd'
import { Transfer } from 'antd'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponent((props) => {
  const { onChange, mapKeysValue, value, itemConfig } = props
  const [selectedMapKeyValue] = mapKeysValue as any
  const { mapKeys = [] } = itemConfig
  const [selectedMapKey] = mapKeys
  /**
   * 使用targetSelectedKeys作为值
   */
  return (
    <Transfer
      targetKeys={value as any}
      selectedKeys={selectedMapKeyValue}
      onChange={(val) => {
        onChange([val, DNCV])
      }}
      onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
        if (selectedMapKey) {
        /**
         * 使用mapKeys第0项储存已选中的值，这里更新表单值
         */
          onChange([DNCV, [[...sourceSelectedKeys, ...targetSelectedKeys]]])
          /**
           * 这里刷新界面
           */
        }
      }}
    >
    </Transfer>
  )
})
