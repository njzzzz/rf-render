import {
  FormItemBridgeProps,
  definePlugin,
} from '@rf-render/core'
import { ComponentType, useContext } from 'react'
import { WidgetProps } from '@rf-render/antd'
import { DNCV } from '../lib/interface.ts'
import { Context } from '../lib/Context.tsx'
import LayoutIndex from './Layout/pc'
import LayoutView from './Layout/pc/view'
import ButtonIndex from './Button/pc'
import ButtonView from './Button/pc/view'
import RadioGroupIndex from './RadioGroup/pc'
import RadioGroupView from './RadioGroup/pc/view'
import FloatButtonIndex from './FloatButton/pc/index'
import FloatButtonView from './FloatButton/pc/view'
import DividerIndex from './Divider/pc/index'
import DividerView from './Divider/pc/view'
import BreadcrumbIndex from './Breadcrumb/pc/index'
import BreadcrumbView from './Breadcrumb/pc/view'
import DropdownIndex from './Dropdown/pc/index'
import DropdownView from './Dropdown/pc/view'
import StepsIndex from './Steps/pc/index'
import StepsView from './Steps/pc/view'
import AutoCompleteIndex from './AutoComplete/pc/index'
import AutoCompleteView from './AutoComplete/pc/view'
import InputIndex from './Input/pc/index'
import InputView from './Input/pc/view'
import TextAreaIndex from './TextArea/pc/index'
import TextAreaView from './TextArea/pc/view'
import PasswordIndex from './Password/pc/index'
import PasswordView from './Password/pc/view'
import CheckboxGroupIndex from './CheckboxGroup/pc/index'
import CheckboxGroupView from './CheckboxGroup/pc/view'
import CascaderIndex from './Cascader/pc/index'
import CascaderView from './Cascader/pc/view'
import CheckboxIndex from './Checkbox/pc/index'
import CheckboxView from './Checkbox/pc/view'
import ColorPickerIndex from './ColorPicker/pc/index'
import ColorPickerView from './ColorPicker/pc/view'
import DatePickerIndex from './DatePicker/pc/index'
import DatePickerView from './DatePicker/pc/view'
import DateRangePickerIndex from './DateRangePicker/pc/index'
import DateRangePickerView from './DateRangePicker/pc/view'
import InputNumberIndex from './InputNumber/pc/index'
import InputNumberView from './InputNumber/pc/view'
import MentionsIndex from './Mentions/pc/index'
import MentionsView from './Mentions/pc/view'
import RateIndex from './Rate/pc/index'
import RateView from './Rate/pc/view'
import SelectIndex from './Select/pc/index'
import SelectView from './Select/pc/view'
import SliderIndex from './Slider/pc/index'
import SliderView from './Slider/pc/view'
import SwitchIndex from './Switch/pc/index'
import SwitchView from './Switch/pc/view'
import TimePickerIndex from './TimePicker/pc/index'
import TimePickerView from './TimePicker/pc/view'
import TimeRangePickerIndex from './TimeRangePicker/pc/index'
import TimeRangePickerView from './TimeRangePicker/pc/view'
import TreeSelectIndex from './TreeSelect/pc/index'
import TreeSelectView from './TreeSelect/pc/view'
import UploadIndex from './Upload/pc/index'
import UploadView from './Upload/pc/view'
import TransferIndex from './Transfer/pc/index'
import TransferView from './Transfer/pc/view'
import ArrayIndex from './Array/pc/index'
import ArrayView from './Array/pc/view'

export const antdRfRenderPlugin = definePlugin([
  {
    name: 'Layout',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return LayoutIndex
        case 'view':
          return LayoutView
        default:
          return LayoutIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Button',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return ButtonIndex
        case 'view':
          return ButtonView
        default:
          return ButtonIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'RadioGroup',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return RadioGroupIndex
        case 'view':
          return RadioGroupView
        default:
          return RadioGroupIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'FloatButton',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return FloatButtonIndex
        case 'view':
          return FloatButtonView
        default:
          return FloatButtonIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Divider',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return DividerIndex
        case 'view':
          return DividerView
        default:
          return DividerIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Breadcrumb',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return BreadcrumbIndex
        case 'view':
          return BreadcrumbView
        default:
          return BreadcrumbIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Dropdown',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return DropdownIndex
        case 'view':
          return DropdownView
        default:
          return DropdownIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Steps',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return StepsIndex
        case 'view':
          return StepsView
        default:
          return StepsIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'AutoComplete',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return AutoCompleteIndex
        case 'view':
          return AutoCompleteView
        default:
          return AutoCompleteIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Input',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return InputIndex
        case 'view':
          return InputView
        default:
          return InputIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'TextArea',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return TextAreaIndex
        case 'view':
          return TextAreaView
        default:
          return TextAreaIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Password',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return PasswordIndex
        case 'view':
          return PasswordView
        default:
          return PasswordIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'CheckboxGroup',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return CheckboxGroupIndex
        case 'view':
          return CheckboxGroupView
        default:
          return CheckboxGroupIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Cascader',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return CascaderIndex
        case 'view':
          return CascaderView
        default:
          return CascaderIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Checkbox',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return CheckboxIndex
        case 'view':
          return CheckboxView
        default:
          return CheckboxIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'ColorPicker',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return ColorPickerIndex
        case 'view':
          return ColorPickerView
        default:
          return ColorPickerIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'DatePicker',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return DatePickerIndex
        case 'view':
          return DatePickerView
        default:
          return DatePickerIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'DateRangePicker',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return DateRangePickerIndex
        case 'view':
          return DateRangePickerView
        default:
          return DateRangePickerIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'InputNumber',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return InputNumberIndex
        case 'view':
          return InputNumberView
        default:
          return InputNumberIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Mentions',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return MentionsIndex
        case 'view':
          return MentionsView
        default:
          return MentionsIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Rate',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return RateIndex
        case 'view':
          return RateView
        default:
          return RateIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Select',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return SelectIndex
        case 'view':
          return SelectView
        default:
          return SelectIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Slider',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return SliderIndex
        case 'view':
          return SliderView
        default:
          return SliderIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Switch',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return SwitchIndex
        case 'view':
          return SwitchView
        default:
          return SwitchIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'TimePicker',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return TimePickerIndex
        case 'view':
          return TimePickerView
        default:
          return TimePickerIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'TimeRangePicker',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return TimeRangePickerIndex
        case 'view':
          return TimeRangePickerView
        default:
          return TimeRangePickerIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'TreeSelect',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return TreeSelectIndex
        case 'view':
          return TreeSelectView
        default:
          return TreeSelectIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Upload',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return UploadIndex
        case 'view':
          return UploadView
        default:
          return UploadIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Transfer',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return TransferIndex
        case 'view':
          return TransferView
        default:
          return TransferIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
  {
    name: 'Array',
    loader: (_platform, fileName) => {
      switch (fileName) {
        case 'index':
          return ArrayIndex
        case 'view':
          return ArrayView
        default:
          return ArrayIndex
      }
    },
    configure: (_platform, fileName) =>
      fileName === 'view'
        ? import('./ViewConfigure.tsx')
        : import('./configure.tsx'),
  },
])

// eslint-disable-next-line react-refresh/only-export-components
export * from './props'

export interface DefineRfRenderComponentProps<
  T extends (...val: any) => any = any,
> {
  /**
   * 自定义onChange事件
   */
  onChange?: (...args: Parameters<T>) => unknown[]
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
export function defineRfRenderComponent<
  Widget extends keyof WidgetProps = keyof WidgetProps,
  T extends ComponentType<FormItemBridgeProps<Widget>> = ComponentType<
    FormItemBridgeProps<Widget>
  >,
>(Component: T) {
  return Component
}
/**
 * - 组件必须有onChange事件，或者配置propsMap映射onChange事件
 * - 如果没有传入上述两个函数则按照默认行为执行
 * - 默认行为：
 *   - 直接抛出组件onChange事件的值[value, mapKey1 mapKey2, ....]
 */
export function defineRfRenderComponentApi<
  T extends Record<string, any> = Record<string, any>,
>(
  Component: ComponentType<any>,
  customer: DefineRfRenderComponentProps<T['onChange']> = {},
) {
  return function RfrenderComponent(props: FormItemBridgeProps) {
    const { onChange, itemConfig } = props
    const { form } = useContext(Context)
    const { props: compProps, name } = itemConfig
    const { propsMap = {}, onChange: onCustomerChange } = customer
    const {
      onChange: onMappedChangeKey = 'onChange',
      value: valueKey = 'value',
    } = propsMap
    const mappedProps = {
      [onMappedChangeKey](...args: any) {
        if (onCustomerChange) {
          const customValue = onCustomerChange(...args)
          const [val] = customValue
          if (val !== DNCV) {
            onChange([val])
          }
        }
        else {
          onChange([...args])
        }
      },
      [valueKey]: form.getFieldValue(name),
    }
    return (
      <Component
        {...compProps}
        {...mappedProps}
        itemConfig={itemConfig}
      >
      </Component>
    )
  }
}
