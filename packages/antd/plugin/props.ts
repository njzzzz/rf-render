import {
  AutoComplete,
  Breadcrumb,
  Button,
  Cascader,
  Checkbox,
  ColProps,
  ColorPicker,
  DatePicker,
  Divider,
  Dropdown,
  FloatButton,
  Input,
  InputNumber,
  InputProps,
  Mentions,
  Radio,
  Rate,
  RowProps,
  Select,
  Slider,
  Steps,
  Switch,
  Table,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from 'antd'
import { ComponentType, ReactNode } from 'react'

export interface ArrayComponentProps {
  /**
   * @description 包裹组件
   */
  Wrapper?: ComponentType<{ children: ReactNode, add: () => void, remove: () => void }>
  /**
   * @description 底部边距
   */
  marginBottom?: string
}

export interface CustomerLayout {
  /**
   * @description 总共几项，不设置默认平分，设置了会计算
   */
  span?: number
  rowProps?: RowProps
  colProps?: ColProps
  /**
   * @description independent 表示独立一行，展示所有子项的label combine 表示组合不展示所有子项的label
   */
  mode?: 'independent' | 'combine'
}
export interface TableExtProps {
  /**
   * @description 是否开放操作列功能
   */
  withOperate?: boolean
  /**
   * @description 隐藏底部的添加按钮
   */
  hideAddButton?: boolean
}
/**
 * 用于widget类型推断,使用本预制插件需要引入此类型
 */
export interface AntdWidgetProps {
  Layout: CustomerLayout
  Button: GetPropsType<typeof Button>
  RadioGroup: GetPropsType<typeof Radio.Group>
  FloatButton: GetPropsType<typeof FloatButton>
  Divider: GetPropsType<typeof Divider>
  Breadcrumb: GetPropsType<typeof Breadcrumb>
  Dropdown: GetPropsType<typeof Dropdown>
  Steps: GetPropsType<typeof Steps>
  AutoComplete: GetPropsType<typeof AutoComplete>
  Input: GetPropsType<typeof Input>
  TextArea: GetPropsType<typeof Input.TextArea>
  Password: GetPropsType<typeof Input.Password>
  CheckboxGroup: GetPropsType<typeof Checkbox.Group>
  Cascader: GetPropsType<typeof Cascader>
  Checkbox: GetPropsType<typeof Checkbox>
  ColorPicker: GetPropsType<typeof ColorPicker>
  DatePicker: GetPropsType<typeof DatePicker>
  DateRangePicker: GetPropsType<typeof DatePicker.RangePicker>
  InputNumber: GetPropsType<typeof InputNumber>
  Mentions: GetPropsType<typeof Mentions>
  Rate: GetPropsType<typeof Rate>
  Select: GetPropsType<typeof Select>
  Slider: GetPropsType<typeof Slider>
  Switch: GetPropsType<typeof Switch>
  TimePicker: GetPropsType<typeof TimePicker>
  TimeRangePicker: GetPropsType<typeof TimePicker.RangePicker>
  Transfer: GetPropsType<typeof Transfer>
  TreeSelect: GetPropsType<typeof TreeSelect>
  Upload: GetPropsType<typeof Upload>
  Array: ArrayComponentProps
  Table: Omit<GetPropsType<typeof Table>, 'dataSource' | 'columns'> & TableExtProps
}
export interface AntdDefaultWidgetProps extends InputProps {

}

export type GetPropsType<T extends (...ars: any[]) => any> = Parameters<T>[0]
