import { StoryObj } from '@storybook/react'
import { RfRender } from '@rf-render/core'
import { DNCV, antdRfRenderPlugin, defineSchema } from '@rf-render/antd'
// import dayjs from 'dayjs'
import RfFormRender from './components/RfFormRender'

// eslint-disable-next-line no-new
new RfRender({
  debugger: 'info',
  defaultWidget: 'Input',
  cover: true,
  plugins: antdRfRenderPlugin,
})
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/RfFormRender',
  component: RfFormRender,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {

  },

  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
}

export default meta
type Story = StoryObj<typeof meta>
// // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const 简单表单: Story = {
  args: {
    layout: 'vertical',
    initialValues: {
      name: '张三',
      age: '19',
      favo: ['eat'],
      province: 'xx省',
      city: 'xx市',
    },
    schema: defineSchema([
      {
        label: '姓名',
        name: 'name',
        itemProps: {
          rules: [{ required: true, message: '请输入姓名' }],
        },
      },
      {
        label: '年龄',
        name: 'age',
        widget: 'InputNumber',
        itemProps: {
          rules: [{ required: true, message: '请输入年龄' }],
        },
        dependOn: ['name'],
        changeValue(formData) {
          const value = formData.name === '张三' ? null : DNCV
          return [value]
        },
      },
      {
        label: '爱好',
        name: 'favo',
        widget: 'CheckboxGroup',
        props: {
          options: [
            { label: '吃', value: 'eat' },
            { label: '喝', value: 'drink' },
            { label: '玩', value: 'play' },
            { label: '乐', value: 'happy' },
          ],
        },
      },
      {
        name: 'location',
        widget: 'Layout',
        layout: [
          {
            label: '省',
            name: 'province',
          },
          {
            label: '市',
            name: 'city',
          },
        ],
      },
    ]),
  },
}

export const 联动表单: Story = {
  args: {
    layout: 'vertical',
    initialValues: {},
    schema: defineSchema([
      {
        name: 'steps',
        widget: 'Steps',
        props: {
          items: [
            {
              title: '第一步',
            },
            {
              title: '第二步',
            },
            {
              title: '第三步',
            },
          ],
        },
      },
      {
        label: '姓名',
        name: 'name',
        itemProps: {
          rules: [{ required: true, message: '请输入姓名' }],
        },
      },
      {
        label: '年龄',
        name: 'age',
        widget: 'InputNumber',
        props: {
          type: 'number',
        },
        itemProps: {
          rules: [{ required: true, message: '请输入年龄' }],
        },
      },
      {
        label: '年龄是否大于18',
        name: 'ageOver18',
        dependOn: ['age'],
        props: {
          disabled: true,
          placeholder: '',
        },
        customerProps: {
          requiredWithRules: true,
        },
        changeValue(formData) {
          return [formData.age ? formData.age > 18 ? '是' : '否' : '']
        },
      },
      {
        label: '爱好',
        name: 'favo',
        widget: 'CheckboxGroup',
        props: {
          options: [
            { label: '吃', value: 'eat' },
            { label: '喝', value: 'drink' },
            { label: '玩', value: 'play' },
            { label: '乐', value: 'happy' },
          ],
        },
      },
      {
        name: 'showlayoutDispaly',
        widget: 'RadioGroup',
        label: '是否显示省市（卸载组件，不保留表单值）',
        props: {
          options: [
            '是',
            '否',
          ],
        },
      },
      {
        name: 'showlayoutVisibility',
        widget: 'RadioGroup',
        label: '是否显示省市（不展示组件，但保留表单值）',
        props: {
          options: [
            '是',
            '否',
          ],
        },
      },
      {
        name: 'location',
        widget: 'Layout',
        dependOn: ['showlayoutVisibility', 'showlayoutDispaly'],
        changeConfig(config, formData) {
          config.display = !!formData.showlayoutDispaly && (formData.showlayoutDispaly === '是')
          config.visibility = !!formData.showlayoutVisibility && (formData.showlayoutVisibility === '是')
          return config
        },
        layout: [
          {
            label: '省',
            name: 'province',
          },
          {
            label: '市',
            name: 'city',
          },
        ],
      },
    ]),
  },
}

export const 所有内置antd组件: Story = {
  args: {
    layout: 'vertical',
    initialValues: {
      AutoComplete: 'xxx',
      Cascader: ['zhejiang', 'hangzhou', 'xihu'],
      Checkbox: true,
      CheckboxGroup: ['Apple'],
      ColorPicker: '#5F9670',
      // DatePicker: dayjs('2023/01/22'),
      // DateRangePicker: [dayjs('2023/01/22 11:11:11'), dayjs('2024/01/22 12:12:12')],
      Input: '输入啥',
      InputNumber: 888,
      Mentions: 'simple',
      RadioGroup: 'Apple',
      Rate: 5,
      Select: 'Apple',
      Slider: [10, 40],
      Steps: 2,
      Switch: true,
      // TimePicker: dayjs('12:08:00', 'HH:mm:ss'),
      // TimeRangePicker: [dayjs('12:00:00', 'HH:mm:ss'), dayjs('13:08:00', 'HH:mm:ss')],
      Transfer: ['0', '1', '2'],
      TransferSelectedKeys: ['0', '1', '2'],
      TreeSelect: 'leaf5',
    },
    schema: defineSchema([
      {
        label: 'AutoComplete',
        name: 'AutoComplete',
        widget: 'AutoComplete',
      },
      {
        label: 'Breadcrumb',
        name: 'Breadcrumb',
        widget: 'Breadcrumb',
        props: {
          items: [
            {
              title: 'Home',
            },
            {
              title: 'Application Center',
            },
            {
              title: 'Application List',
            },
            {
              title: 'An Application',
            },
          ],
        },

      },
      {
        label: 'Button',
        name: 'Button',
        widget: 'Button',
        props: {
          children: '按钮',
          type: 'primary',
        },
      },
      {
        label: 'Cascader',
        name: 'Cascader',
        widget: 'Cascader',
        props: {
          options: [
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [
                    {
                      value: 'xihu',
                      label: 'West Lake',
                    },
                  ],
                },
              ],
            },
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: 'Checkbox',
        name: 'Checkbox',
        widget: 'Checkbox',
      },
      {
        label: 'CheckboxGroup',
        name: 'CheckboxGroup',
        widget: 'CheckboxGroup',
        props: {
          options: [
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange' },
          ],
        },
      },
      {
        label: 'ColorPicker',
        name: 'ColorPicker',
        widget: 'ColorPicker',
      },
      {
        label: 'DatePicker',
        name: 'DatePicker',
        widget: 'DatePicker',
      },
      {
        label: 'DateRangePicker',
        name: 'DateRangePicker',
        widget: 'DateRangePicker',
        props: {
          showTime: true,
        },
      },
      {
        label: 'Divider',
        name: 'Divider',
        widget: 'Divider',
      },
      {
        label: 'Dropdown',
        name: 'Dropdown',
        widget: 'Dropdown',
        props: {
          children: <div>Hover me</div>,
          menu: {
            items: [
              {
                key: '1',
                label: (
                  <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                  </a>
                ),
              },
              {
                key: '2',
                label: (
                  <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                  </a>
                ),
                disabled: true,
              },
            ],
          },
        },
      },
      {
        label: 'FloatButton',
        name: 'FloatButton',
        widget: 'FloatButton',
      },
      {
        label: 'Input',
        name: 'Input',
        widget: 'Input',
      },
      {
        label: 'InputNumber',
        name: 'InputNumber',
        widget: 'InputNumber',
      },
      {
        name: 'Layout',
        widget: 'Layout',
        label: 'Layout',
        layout: [
          {
            label: '省',
            name: 'province',
          },
          {
            label: '市',
            name: 'city',
          },
        ],
      },
      {
        label: 'Mentions',
        name: 'Mentions',
        widget: 'Mentions',
        props: {
          options: [{ value: 'sample', label: 'sample' }],
        },
      },
      {
        label: 'RadioGroup',
        name: 'RadioGroup',
        widget: 'RadioGroup',
        props: {
          options: [
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange', title: 'Orange' },
          ],
        },
      },
      {
        label: 'Rate',
        name: 'Rate',
        widget: 'Rate',
      },
      {
        label: 'Select',
        name: 'Select',
        widget: 'Select',
        props: {
          options: [
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange', title: 'Orange' },
          ],
        },
      },
      {
        label: 'Slider',
        name: 'Slider',
        widget: 'Slider',
        props: {
          range: true,
          step: 10,
        },
      },
      {
        label: 'Steps',
        name: 'Steps',
        widget: 'Steps',
        props: {
          items: [
            {
              title: '第一步',
            },
            {
              title: '第二步',
            },
            {
              title: '第三步',
            },
          ],
        },
      },
      {
        label: 'Switch',
        name: 'Switch',
        widget: 'Switch',
      },
      {
        label: 'TimePicker',
        name: 'TimePicker',
        widget: 'TimePicker',
        customerProps: {
          requiredWithRules: true,
        },
      },
      {
        label: 'TimeRangePicker',
        name: 'TimeRangePicker',
        widget: 'TimeRangePicker',
      },
      {
        label: 'Transfer',
        name: 'Transfer',
        widget: 'Transfer',
        mapKeys: ['TransferSelectedKeys'],
        props: {
          dataSource: Array.from({ length: 20 }).map((_, i) => ({
            key: i.toString(),
            title: `content${i + 1}`,
            description: `description of content${i + 1}`,
          })),
          titles: ['Source', 'Target'],
          render: (item: any) => item.title,
        },
      },
      {
        label: 'TreeSelect',
        name: 'TreeSelect',
        widget: 'TreeSelect',
        props: {
          treeData: [
            {
              value: 'parent 1',
              title: 'parent 1',
              children: [
                {
                  value: 'parent 1-0',
                  title: 'parent 1-0',
                  children: [
                    {
                      value: 'leaf1',
                      title: 'leaf1',
                    },
                    {
                      value: 'leaf2',
                      title: 'leaf2',
                    },
                    {
                      value: 'leaf3',
                      title: 'leaf3',
                    },
                    {
                      value: 'leaf4',
                      title: 'leaf4',
                    },
                    {
                      value: 'leaf5',
                      title: 'leaf5',
                    },
                    {
                      value: 'leaf6',
                      title: 'leaf6',
                    },
                  ],
                },
                {
                  value: 'parent 1-1',
                  title: 'parent 1-1',
                  children: [
                    {
                      value: 'leaf11',
                      title: <b style={{ color: '#08c' }}>leaf11</b>,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: 'Upload',
        name: 'Upload',
        widget: 'Upload',
      },
    ]),
  },
}
