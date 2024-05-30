import { FormItemBridgeProps, definePlugin } from '@rf-render/core'
import { lazy } from 'react'
/**
 * 暂时只适配了pc
 */
export const antdRfRenderPlugin = definePlugin([
  {
    name: 'Layout',
    loader: (_platform, fileName) => lazy(() => import(`./Layout/pc/${fileName}.tsx`)),
  },
  {
    name: 'Button',
    loader: (_platform, fileName) => lazy(() => import(`./Button/pc/${fileName}.tsx`)),
  },
  {
    name: 'RadioGroup',
    loader: (_platform, fileName) => lazy(() => import(`./RadioGroup/pc/${fileName}.tsx`)),
  },
])

// eslint-disable-next-line react-refresh/only-export-components
export * from './props'

export interface DefinefRenderComponentProps {
  /**
   * 自定义onChange事件
   */
  onChange?: (rfrender: FormItemBridgeProps['rfrender'], ...val: any) => any
  /**
   * 自定义onMapKeysChange事件
   */
  onMapKeysChange?: (rfrender: FormItemBridgeProps['rfrender'], ...val: any) => any
  /**
   * 事件映射，比如你的组件修改值的事件不叫onChange可以在此处做映射
   */
  propsMap?: {
    onChange?: string
  }
}

/**
 * - 组件必须有onChange事件，或者配置propsMap映射onChange事件
 * - 触发onChange时会同时触发传入的onChange和onMapKeysChange事件
 * - 如果没有传入上述两个函数则按照默认行为执行
 * - 默认行为：
 *   - 直接抛出组件onChange事件的值
 *   - 同时执行onMapKeysChange事件，往mapKeys配置的字段中写入组件onChange事件第二项的值，因为antd的onChange事件第二项的值是个obj
 */
export function defineRfRenderComponent(Component: any, customer: DefinefRenderComponentProps = {}) {
  return function RfrenderComponent(props: FormItemBridgeProps) {
    const { onChange, onMapKeysChange, rfrender, ...inherits } = props
    const { item = {} } = rfrender
    const { props: compProps = {} } = item
    const { propsMap = {}, onChange: onCustomerChange, onMapKeysChange: onCustomerMapKeysChange } = customer
    const { onChange: onMapedChange = 'onChange' } = propsMap
    const inheritsChangeFunc = {
      async [onMapedChange](...args: unknown[]) {
        if (onCustomerChange) {
          onChange(await onCustomerChange(rfrender, ...args))
        }
        else {
          onChange(...args)
        }
        if (onCustomerMapKeysChange) {
          onMapKeysChange(await onCustomerMapKeysChange(rfrender, ...args))
        }
        else {
          onMapKeysChange([args[1]])
        }
      },
    }

    return (
      <Component
        {...inherits}
        {...inheritsChangeFunc}
        {...compProps}
        rfrender={rfrender}
      >
      </Component>
    )
  }
}
