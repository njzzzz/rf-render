import { useContext, useEffect, useState } from 'react'
import { RfRender } from '@rf-render/core'
import { Context } from '@rf-render/antd'

export function useReloadWidget() {
  const { formName } = useContext(Context)
  const [reloadWidget, setReloadWidget] = useState(false)
  // 监听表单试图切换事件以切换表单项组件状态
  useEffect(() => {
    const listener = () => {
      setReloadWidget(v => !v)
    }
    RfRender.addSwitchListener(formName, listener)
    return () => RfRender.removeSwitchListener(formName, listener)
  }, [formName])
  return {
    reloadWidget,
  }
}
