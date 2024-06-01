import { lazy, useEffect, useState } from 'react'
import { Component, FormItemBridgeProps, RfRender } from '@rf-render/core'
import { SuspenseWrapper } from '@rf-render/antd'

// loader for react
export function loader(component: Component) {
  return (props: FormItemBridgeProps) => {
    const [Component, setComponent] = useState<ReturnType<typeof lazy> | null>(null)
    const [reload, setReload] = useState(false)
    useEffect(() => {
      const listener = () => {
        setReload(!reload)
      }
      RfRender.addSwitchListener(listener)
      return () => {
        RfRender.removeSwitchListener(listener)
      }
    }, [reload])

    useEffect(() => {
      setComponent(component.loader(RfRender.platform, RfRender.fileName))
    }, [reload])

    return (
      Component && <SuspenseWrapper Component={Component!} component={component} formItemBridgeProps={props} />
    )
  }
}
