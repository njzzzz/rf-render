import { StoryObj } from '@storybook/react'
import { RfRender } from '@rf-render/core'
import { antdRfRenderPlugin, defineSchema } from '@rf-render/antd'
// import dayjs from 'dayjs'
import { BaseOptionType } from 'antd/es/select'
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
        customerProps: {
          requiredWithRules: true,
        },
      },
      {
        label: '年龄',
        name: 'age',
        widget: 'InputNumber',
        customerProps: {
          requiredWithRules: true,
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

export const 联动表单之修改配置: Story = {
  args: {
    layout: 'vertical',
    initialValues: {
      showSelect: '2',
    },
    schema: defineSchema([
      {
        label: '是否显示Select',
        name: 'showSelect',
        widget: 'RadioGroup',
        props: {
          options: [
            {
              value: '1',
              label: '是',
            },
            {
              value: '2',
              label: '否',
            },
          ],
        },
      },
      {
        label: 'Select',
        name: 'Select',
        widget: 'Select',
        props: {
          options: [
            {
              value: '1',
              label: '第一项',
            },
            {
              value: '2',
              label: '第二项',
            },
          ],
        },
        dependOn: ['showSelect'],
        changeConfig(config, formData) {
          return { ...config, display: formData.showSelect === '1' }
        },
      },
    ]),
  },
}

export const 联动表单之修改值: Story = {
  args: {
    layout: 'vertical',
    initialValues: {
      changeSelect: '2',
    },
    schema: defineSchema([
      {
        label: '同步修改Select的值',
        name: 'changeSelect',
        widget: 'RadioGroup',
        props: {
          options: [
            {
              value: '1',
              label: '第一项',
            },
            {
              value: '2',
              label: '第二项',
            },
          ],
        },
      },
      {
        label: 'Select',
        name: 'Select',
        widget: 'Select',
        props: {
          options: [
            {
              value: '1',
              label: '第一项',
            },
            {
              value: '2',
              label: '第二项',
            },
          ],
        },
        dependOn: ['changeSelect'],
        changeValue(formData) {
          return [formData.changeSelect]
        },
      },
    ]),
  },
}
async function mock3sRequest() {
  return new Promise<BaseOptionType[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          value: '1',
          label: '第一项',
        },
        {
          value: '2',
          label: '第二项',
        },
      ])
    }, 3000)
  })
}

export const 联动表单之使用接口初始化Select选项: Story = {
  args: {
    layout: 'vertical',
    initialValues: {
      Select: '2',
    },
    schema: defineSchema([
      {
        label: 'Select-配置initConfig在3s后接口返回展示选中文案',
        name: 'Select',
        widget: 'Select',
        async initConfig(config) {
          const options = await mock3sRequest()
          return {
            ...config,
            props: {
              options,
            },
          }
        },
      },
    ]),
  },
}
export const 联动表单之取消首次渲染立即执行deps: Story = {
  args: {
    layout: 'vertical',
    immediateDeps: false,
    initialValues: {
      changeSelect: '2',
    },
    schema: defineSchema([
      {
        label: '虽然设置了同步修改Select的值，且当前选项的值为第二项，但是设置immediateDeps=false后，不会立即触发，需要用户操作才能触发',
        name: 'changeSelect',
        widget: 'RadioGroup',
        props: {
          options: [
            {
              value: '1',
              label: '点我触发修改Select值为第一项',
            },
            {
              value: '2',
              label: '第二项',
            },
          ],
        },
      },
      {
        label: 'Select',
        name: 'Select',
        widget: 'Select',
        props: {
          options: [
            {
              value: '1',
              label: '第一项',
            },
            {
              value: '2',
              label: '第二项',
            },
          ],
        },
        dependOn: ['changeSelect'],
        changeValue(formData) {
          return [formData.changeSelect]
        },
      },
    ]),
  },
}

export const 联动表单之立即执行deps同时触发表单验证: Story = {
  args: {
    immediateValidate: true,
    layout: 'vertical',
    initialValues: {
      first: 1,
    },
    schema: defineSchema([
      {
        label: '第一项',
        name: 'first',
        widget: 'InputNumber',
        customerProps: {
          requiredWithRules: true,
        },
      },
      {
        label: '当前项的值为第一项的值+1(当第一项为1是当前项的值为null)',
        name: 'second',
        widget: 'InputNumber',
        customerProps: {
          requiredWithRules: true,
        },
        dependOn: ['first'],
        changeValue(formData) {
          return [formData.first === 1 ? null : formData.first + 1]
        },
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
