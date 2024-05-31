import { defineRfRenderComponent } from '@rf-render/antd'
import { Transfer } from 'antd'
import { useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponent((props) => {
  const { rfrender, onChange, onMapKeysChange, ..._ } = props
  const { form, item } = rfrender
  const { name, mapKeys = [] } = item
  const [selectedMapKey] = mapKeys
  const [rfSelectedKeys, setRfSelectedKeys] = useState<any[]>(form.getFieldValue(selectedMapKey) ?? [])
  /**
   * 使用targetSelectedKeys作为值
   */
  const value = name ? form.getFieldValue(name) ?? [] : []
  return (
    <Transfer
      targetKeys={value}
      selectedKeys={rfSelectedKeys}
      onChange={onChange}
      onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
        if (selectedMapKey) {
        /**
         * 使用mapKeys第0项储存已选中的值，这里更新表单值
         */
          onMapKeysChange([[...sourceSelectedKeys, ...targetSelectedKeys]])
          /**
           * 这里刷新界面
           */
          setRfSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
        }
        else {
          setRfSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
        }
      }}
      {..._}
    >
    </Transfer>
  )
})
