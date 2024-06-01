import { FormItemBridgeProps, definePlugin } from '@rf-render/core'
import { FormInstance } from 'antd'
import { lazy } from 'react'
/**
 * 暂时只适配了pc
 */
export const antdRfRenderPlugin = definePlugin([
  {
    name: 'Layout',
    loader: (_platform, fileName) => lazy(() => import(`./Layout/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Button',
    loader: (_platform, fileName) => lazy(() => import(`./Button/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'RadioGroup',
    loader: (_platform, fileName) => lazy(() => import(`./RadioGroup/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'FloatButton',
    loader: (_platform, fileName) => lazy(() => import(`./FloatButton/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Divider',
    loader: (_platform, fileName) => lazy(() => import(`./Divider/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Breadcrumb',
    loader: (_platform, fileName) => lazy(() => import(`./Breadcrumb/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Dropdown',
    loader: (_platform, fileName) => lazy(() => import(`./Dropdown/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Steps',
    loader: (_platform, fileName) => lazy(() => import(`./Steps/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'AutoComplete',
    loader: (_platform, fileName) => lazy(() => import(`./AutoComplete/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Input',
    loader: (_platform, fileName) => lazy(() => import(`./Input/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'CheckboxGroup',
    loader: (_platform, fileName) => lazy(() => import(`./CheckboxGroup/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Cascader',
    loader: (_platform, fileName) => lazy(() => import(`./Cascader/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Checkbox',
    loader: (_platform, fileName) => lazy(() => import(`./Checkbox/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'ColorPicker',
    loader: (_platform, fileName) => lazy(() => import(`./ColorPicker/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'DatePicker',
    loader: (_platform, fileName) => lazy(() => import(`./DatePicker/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'DateRangePicker',
    loader: (_platform, fileName) => lazy(() => import(`./DateRangePicker/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'InputNumber',
    loader: (_platform, fileName) => lazy(() => import(`./InputNumber/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Mentions',
    loader: (_platform, fileName) => lazy(() => import(`./Mentions/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Rate',
    loader: (_platform, fileName) => lazy(() => import(`./Rate/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Select',
    loader: (_platform, fileName) => lazy(() => import(`./Select/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Slider',
    loader: (_platform, fileName) => lazy(() => import(`./Slider/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Switch',
    loader: (_platform, fileName) => lazy(() => import(`./Switch/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'TimePicker',
    loader: (_platform, fileName) => lazy(() => import(`./TimePicker/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'TimeRangePicker',
    loader: (_platform, fileName) => lazy(() => import(`./TimeRangePicker/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'TreeSelect',
    loader: (_platform, fileName) => lazy(() => import(`./TreeSelect/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Upload',
    loader: (_platform, fileName) => lazy(() => import(`./Upload/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
  {
    name: 'Transfer',
    loader: (_platform, fileName) => lazy(() => import(`./Transfer/pc/${fileName}.tsx`)),
    configure: (_platform, fileName) => fileName === 'view' ? import('./ViewConfigure.tsx') : import('./configure.tsx'),
  },
])

// eslint-disable-next-line react-refresh/only-export-components
export * from './props'

export interface DefineRfRenderComponentProps {
  /**
   * 自定义onChange事件
   */
  onChange?: (rfrender: FormItemBridgeProps<FormInstance>['rfrender'], ...val: any) => any
  /**
   * 自定义onMapKeysChange事件
   */
  onMapKeysChange?: (rfrender: FormItemBridgeProps<FormInstance>['rfrender'], ...val: any) => any
  /**
   * 事件映射，比如你的组件修改值的事件不叫onChange可以在此处做映射
   */
  propsMap?: {
    onChange?: string
    /**
     * 组件接受的值，默认为'value'
     */
    value?: string
  }
}
/**
 * 自定义组件使用以获取类型提示
 */
export function defineRfRenderComponent<T extends (props: FormItemBridgeProps<FormInstance>) => any>(component: T) {
  return component
}
/**
 * - 组件必须有onChange事件，或者配置propsMap映射onChange事件
 * - 触发onChange时会同时触发传入的onChange和onMapKeysChange事件
 * - 如果没有传入上述两个函数则按照默认行为执行
 * - 默认行为：
 *   - 直接抛出组件onChange事件的值
 *   - 同时执行onMapKeysChange事件，往mapKeys配置的字段中写入组件onChange事件第二项的值，因为antd的onChange事件第二项的值是个obj
 */
export function defineRfRenderComponentApi(Component: any, customer: DefineRfRenderComponentProps = {}) {
  return function RfrenderComponent(props: FormItemBridgeProps<FormInstance>) {
    const { onChange, onMapKeysChange, rfrender, ...inherits } = props
    const { item = {}, form } = rfrender
    const { props: compProps = {}, name } = item
    const { propsMap = {}, onChange: onCustomerChange, onMapKeysChange: onCustomerMapKeysChange } = customer
    const { onChange: onMapedChange = 'onChange', value = 'value' } = propsMap
    const mapedProps = {
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
      [value]: form.getFieldValue(name),
    }

    return (
      <Component
        {...inherits}
        {...mapedProps}
        {...compProps}
        rfrender={rfrender}
      >
      </Component>
    )
  }
}
