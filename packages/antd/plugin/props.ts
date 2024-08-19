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
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from 'antd'

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
}
export interface AntdDefaultWidgetProps extends InputProps {

}

export type GetPropsType<T extends (...ars: any[]) => any> = Parameters<T>[0]
