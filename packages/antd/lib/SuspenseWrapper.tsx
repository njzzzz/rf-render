import { Component, FormItemBridgeProps } from '@rf-render/core'
import { ReactNode, Suspense, useLayoutEffect } from 'react'

interface IProps {
  Component: React.LazyExoticComponent<React.ComponentType<any>>
  component: Component
  formItemBridgeProps: FormItemBridgeProps
  onComplete: ILazyWrapperForCheckCompleteProps['onComplete']
  [key: string]: any
}
export interface ILazyWrapperForCheckCompleteProps {
  onComplete: (...args: any) => any
  children: ReactNode
}
function LazyWrapperForCheckCompleteProps({ onComplete, children }: ILazyWrapperForCheckCompleteProps) {
  useLayoutEffect(() => {
    if (onComplete) {
      onComplete()
    }
  }, [])
  return children
}
export function SuspenseWrapper(props: IProps) {
  const { component, Component, formItemBridgeProps, onComplete, ...antdInjectedProps } = props
  const { onMapKeysChange, onChange: bridgeOnChange, ...configProps } = formItemBridgeProps
  const { onChange: antdOnChange } = antdInjectedProps
  const onChange = (val: unknown) => {
    bridgeOnChange(val)
    antdOnChange && antdOnChange(val)
  }
  return (
    <Suspense {...component.SuspenseProps}>
      <LazyWrapperForCheckCompleteProps onComplete={onComplete}>
        <Component {...antdInjectedProps} {...configProps} onChange={(v: unknown) => onChange(v)} onMapKeysChange={onMapKeysChange}></Component>
      </LazyWrapperForCheckCompleteProps>
    </Suspense>
  )
}
