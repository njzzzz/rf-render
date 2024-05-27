import { Component, FormItemBridgeProps } from '@rf-render/core'
import { Suspense } from 'react'

interface IProps {
  Component: React.LazyExoticComponent<React.ComponentType<any>>
  component: Component
  formItemBridgeProps: FormItemBridgeProps
  [key: string]: any
}
export function SuspenseWrapper(props: IProps) {
  const { component, Component, formItemBridgeProps, ...antdInjectedProps } = props
  const { onMapKeysChange, onChange: bridgeOnChange, ...configProps } = formItemBridgeProps
  const { onChange: antdOnChange } = antdInjectedProps
  const onChange = (val: unknown) => {
    bridgeOnChange(val)
    antdOnChange && antdOnChange(val)
  }
  return (
    <Suspense {...component.SuspenseProps}>
      <Component {...antdInjectedProps} {...configProps} onChange={(v: unknown) => onChange(v)} onMapKeysChange={onMapKeysChange}></Component>
    </Suspense>
  )
}
