import { StoryObj } from '@storybook/react'
import { RfRender } from '@rf-render/core'
import { antdRfRenderPlugin, defineSchema } from '@rf-render/antd'
// import dayjs from 'dayjs'
import { BaseOptionType } from 'antd/es/select'
import { Button } from 'antd'
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
  title: 'Components/useFormRender',
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
          options: [],
        },
        async initConfig(config) {
          config.props = {
            options: [
              { label: '吃', value: 'eat' },
              { label: '喝', value: 'drink' },
              { label: '玩', value: 'play' },
              { label: '乐', value: 'happy' },
            ],
          }
          return config
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
      showSelect: '1',
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
        changeConfig(_config, formData) {
          return { display: formData.showSelect === '1' }
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
          console.log(formData)
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

export const 组合布局组件: Story = {
  args: {
    layout: 'vertical',
    schema: defineSchema([
      {
        widget: 'Layout',
        label: '一行两列:',
        name: 'layout1',
        props: {
          span: 3,
          mode: 'combine',
        },
        layout: [
          {
            name: '项目2-1',
            label: '项目2-1',
            customerProps: {
              requiredWithRules: true,
            },
          },
          {
            name: '项目2-2',
            props: {
              placeholder: '请输入项目',
            },
          },

        ],
      },
      {
        widget: 'Layout',
        label: '一行三列:',
        name: 'layout2',
        props: {
          span: 3,
        },
        layout: [
          {
            name: '项目3-1',
            props: {
              placeholder: '请输入项目',
            },
          },
          {
            name: '项目3-2',
            props: {
              placeholder: '请输入项目',
            },
          },
          {
            name: '项目3-3',
            props: {
              placeholder: '请输入项目',
            },
          },

        ],
      },

    ]),
  },
}
export const 独立布局组件: Story = {
  args: {
    layout: 'vertical',
    schema: defineSchema([
      {
        widget: 'Layout',
        name: 'layout1',
        props: {
          span: 3,
          mode: 'independent',
        },
        layout: [
          {
            name: '项目2-1',
            label: '项目2-1',
            fileName: 'view',
            customerProps: {
              requiredWithRules: true,
            },
          },
          {
            name: '项目2-3',
            label: '项目2-3',
            widget: 'Layout',
            colProps: {
              span: 16,
            },
            props: {
              mode: 'combine',
            },
            itemProps: {
              required: true,
            },
            layout: [
              {
                name: 'x1',
                customerProps: {
                  requiredWithRules: true,
                },
              },
              {
                name: 'x2',
              },
            ],
          },

        ],
      },
      {
        widget: 'Layout',
        name: 'layout2',
        props: {
          span: 3,
        },
        layout: [
          {
            name: '项目3-1',
            label: '项目3-1',
            props: {
              placeholder: '请输入项目',
            },
          },
          {
            name: '项目3-2',
            label: '项目3-2',
            props: {
              placeholder: '请输入项目',
            },
          },
          {
            name: '项目3-3',
            label: '项目3-3',
            props: {
              placeholder: '请输入项目',
            },
          },

        ],
      },

    ]),
  },
}

async function MockRequestWithId(id: string) {
  try {
    await fetch(`http://mock.com/mockwithid?ud=${id}`)
  }
  catch (error) {

  }
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(id), 3000)
  })
}

export const 远程获取数据: Story = {
  args: {
    initialValues: {
      数据源id: '1',
    },
    schema: defineSchema([
      {
        name: '数据源id',
        label: '数据源id',
        widget: 'Select',
        props: {
          options: [
            { label: '请求id为1返回1', value: '1' },
            { label: '请求id为2返回2', value: '2' },
            { label: '请求id为3返回3', value: '3' },
          ],
        },
      },
      {
        name: '返回数据源展示',
        label: '返回数据源展示',
        widget: 'Select',
        dependOn: [
          '数据源id',
        ],
        independentOn: [{
          dependOn: ['text', '返回数据源展示'],
          changeConfig(config, { 返回数据源展示, text }) {
            console.log(111)
            config.display = 返回数据源展示 === '返回数据源展示' ? false : text !== 'text'
            return config
          },
        }],
        props: {
        },
        async changeConfig(config, { 数据源id }) {
          const id = await MockRequestWithId(数据源id)
          config.props = {
            ...config.props,
            options: [
              { label: id, value: id },
            ],
          }
          return config
        },
      },
      {
        name: 'text',
        label: '文字',

      },
    ]),
  },
}

export const Array组件: Story = {
  args: {
    initialValues: {
      array: [{ 'name-1': '111', 'name-2': '222' }],
    },
    schema: defineSchema([
      {
        name: 'name-1',
        label: '第一项',
        customerProps: {
          requiredWithRules: true,
        },
        itemProps: {
          tooltip: `第一项依赖数组项的第一项的第一项，当其变动会将其值赋值给当前项,当其值为'隐藏第一项'则当前项隐藏'`,
        },
        dependOn: ['array.0.name-1'],
        changeValue(formData) {
          return [formData['array.0.name-1']]
        },
        changeConfig(config, formData) {
          config.display = formData['array.0.name-1'] !== '隐藏第一项'
          return config
        },
      },
      {
        name: 'name-2',
        label: '第二项',
        itemProps: {
          tooltip: '第二项依赖整个数组项,值为整个数组项的长度',
        },
        customerProps: {
          requiredWithRules: true,
        },
        dependOn: ['array'],
        changeValue(formData) {
          return [formData.array?.length]
        },
      },
      {
        name: 'array',
        label: '数组项',
        widget: 'Array',
        layout: [
          {
            name: 'name-1',
            label: '数组项的第一项',
            customerProps: {
              requiredWithRules: true,
            },
            itemProps: {
              tooltip: '数组项的第一项依赖外部的第一项，placeholder为外部的第一项的值（外部依赖只能通过independentOn进行配置）',
            },
            independentOn: [
              {
                dependOn: ['name-1'],
                changeConfig(config, formData) {
                  config.props = {
                    placeholder: formData['name-1'],
                  }
                  return config
                },
              },
            ],
          },
          {
            name: 'name-2',
            label: '数组项的第二项',
          },
          {
            name: 'name-3',
            label: '数组项的第三项',
            dependOn: ['name-2'],
            itemProps: {
              tooltip: '数组项的第三项依赖数组项的第二项，placeholder为数组项的第二项的值',
            },
            changeConfig(config, formData, customProps) {
              console.log(formData, customProps)
              config.props = {
                placeholder: formData.array[customProps.index]['name-2'],
              }
              return config
            },
          },
        ],
      },
    ]),
  },
}
export const Table组件: Story = {
  args: {
    initialValues: {
      table: [
        {
          name: '111',
          age: 11,
        },
        {
          name: '222',
          age: 22,
        },
      ],
    },
    schema: defineSchema([
      {
        name: 'table',
        label: '表格',
        widget: 'Table',
        layout: [
          {
            name: 'name',
            label: '姓名',
          },
          {
            name: 'age',
            label: '年龄',
          },
        ],
      },
    ]),
  },
}
export const Table组件之自定义操作栏同时隐藏底部添加按钮: Story = {
  args: {
    initialValues: {
      table: [
        {
          name: '张三',
          age: 20,
          lover: 'smoke',
        },
        {
          name: '李四',
          age: 22,
          lover: 'smoke',
        },
      ],
    },
    schema: defineSchema([
      {
        name: 'table',
        label: '表格',
        widget: 'Table',
        props: {
          withOperate: false,
          hideAddButton: true,
          pagination: {
            pageSize: 5,
          },
        },
        layout: [
          {
            name: '-name-',
            label: '个人信息',
            layout: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
                customerProps: {
                  requiredWithRules: true,
                },
              },
            ],
          },
          {
            name: 'lover',
            label: '爱好',
          },
          {
            name: 'operate',
            label: '操作',
            render: (_val, record, _index, { add, remove, realIndex }) => {
              return (
                <div>
                  <Button onClick={() => add(realIndex + 1)} type="link" style={{ padding: 0, marginRight: '8px' }}>
                    添加
                  </Button>
                  <Button onClick={() => remove(record)} type="link" danger style={{ padding: 0, margin: 0 }}>
                    删除
                  </Button>
                </div>
              )
            },
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
      TextArea: 'TextArea',
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
      Text: 'Text',
    },
    schema: defineSchema([
      {
        label: 'Text',
        name: 'Text',
        widget: 'Text',
        props: {
          render: val => <div style={{ color: 'red' }}>{val}</div>,
        },
      },
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
        label: 'TextArea',
        name: 'TextArea',
        widget: 'TextArea',
      },
      {
        label: 'Password',
        name: 'Password',
        widget: 'Password',
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
