import { Suspense, lazy, useEffect, useState } from 'react'
import { Component, RfRender } from '@rf-render/core'

// loader for react
export function loader(component: Component) {
  return <T extends Record<string, any>>(props: T) => {
    const [Component, setComponent] = useState<ReturnType<typeof lazy> | null>(null)
    const [reload, setReload] = useState(false)
    useEffect(() => {
      const listener = { reload, setReload }
      RfRender.addSwitchListener(listener)
      return () => {
        RfRender.removeSwitchListener(listener)
      }
    }, [reload])

    useEffect(() => {
      setComponent(component.loader(RfRender.platform, RfRender.fileName))
    }, [reload])
    return (
      <Suspense {...component.SuspenseProps}>
        {Component && <Component {...props} />}
      </Suspense>
    )
  }
}
