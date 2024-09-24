import {
  Context,
  FormItemBridgeWrapper,
  TableLayout,
  defineRfRenderComponent,
} from '@rf-render/antd'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { Button, Table } from 'antd'

function generateUID() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
}
type Value = Record<string, unknown>
type Values = Value[]
// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponent<'Table'>(({ itemConfig, onChange }) => {
  const { layout = [], name: parentName, props = {} } = itemConfig
  const { withOperate = true, hideAddButton = false } = props
  const { form } = useContext(Context)
  const value = form.getFieldValue(parentName) as Values ?? []
  // 维护key
  const valueIdsRef = useRef<WeakMap<Value, string>>(
    value.reduce((map: WeakMap<Value, string>, values) => {
      map.set(values, generateUID())
      return map
    }, new Map()),
  )
  const genFormData = (layout: TableLayout) => {
    value.forEach((values, index) => {
      valueIdsRef.current.set(values, valueIdsRef.current.get(values) || generateUID())
      layout.forEach(({ name, layout = [] }) => {
        if (layout.length) {
          genFormData(layout)
        }
        else {
          form.setFieldValue(`${parentName}.${index}.${name}`, values[name])
        }
      })
    })
  }
  // 初始化设置子项值
  useEffect(() => {
    genFormData(layout)
  }, [value])

  const add = (index?: number) => {
    const newValueItem = {}
    // 生成key
    valueIdsRef.current.set(newValueItem, generateUID())
    let v = [...value]
    if (typeof index === 'number') {
      v.splice(index, 0, newValueItem)
    }
    else {
      v = [...v, newValueItem]
    }
    onChange([v])
  }

  const remove = (v: Value) => {
    // 生成key
    valueIdsRef.current.delete(v)
    onChange([value.filter(val => val !== v)])
  }
  const genRender = (item: TableLayout[number]): any => {
    const { name, label, mapKeys, dependOn, render, customerProps = {}, layout = [], ...columnProps } = item as TableLayout[number]
    const { requiredWithRules = false } = customerProps
    const commonProps = {
      ...columnProps,
      title: requiredWithRules
        ? (
          <span>
            <span style={{ color: '#ff4d4f', marginRight: '4px', lineHeight: 1 }}>*</span>
            {label}
          </span>
          )
        : label,
    }
    if (layout?.length) {
      return {
        ...commonProps,
        children: layout.map(genRender),
      }
    }
    else {
      return {
        ...commonProps,
        render(_: any, record: Value, index: number) {
          const realIndex = value.findIndex(item => item === record)
          // 处理dependOn映射，以解决数组类型同层依赖
          const mapName = `${parentName}.${realIndex}.${name}`
          const mapDependOn = dependOn?.map((dep: any) => {
            return `${parentName}.${realIndex}.${dep}`
          })
          const ColRender = (
            <FormItemBridgeWrapper
              key={mapName}
              itemConfig={{ hideLabelUi: true, ...item, name: mapName, dependOn: mapDependOn }}
              onValuesChange={([curValue, ...mapValue]) => {
                const value = form.getFieldValue(parentName) as Values
                // 更新父级表单项值
                onChange([
                  value.map((item, vIndex) => {
                    if (vIndex === realIndex) {
                      const mapKeysValue = mapKeys?.reduce((acc: Record<string, unknown>, mapKey: any, index: number) => {
                        acc[mapKey] = mapValue[index]
                        return acc
                      }, {})
                      const newValue = {
                        ...item,
                        [name]: curValue,
                        ...mapKeysValue,
                      }
                      // 更新key
                      valueIdsRef.current.set(newValue, valueIdsRef.current.get(record) ?? generateUID())
                      valueIdsRef.current.delete(record)
                      return newValue
                    }
                    return item
                  }),
                ])
              }}
              customProps={{
                index: realIndex,
                parentName,
                name,
                parentConfig: itemConfig,
              }}
              style={{
                marginBottom: 0,
              }}
            />
          )
          return render ? render(record[name], record, index, { render: ColRender, form, add, remove, name: mapName, realIndex }) : ColRender
        },

      }
    }
  }
  const columns = useMemo(() => {
    const layoutToColumns = layout.map((item) => {
      return genRender(item)
    })
    if (withOperate) {
      return [
        ...layoutToColumns,
        {
          title: '操作',
          width: 130,
          dataIndex: 'operate',
          render: (_val: any, record: Value) => {
            const realIndex = value.findIndex(item => item === record)
            return (
              <>
                <Button onClick={() => add(realIndex + 1)} type="link" style={{ padding: 0, marginRight: '8px' }}>
                  添加项
                </Button>
                <Button onClick={() => remove(record)} type="link" danger style={{ padding: 0, margin: 0 }}>
                  删除项
                </Button>
              </>
            )
          },
        },
      ]
    }
    return layoutToColumns
  }, [value])
  return (
    <>
      <Table pagination={false} {...props} columns={columns} dataSource={value}>
      </Table>
      {hideAddButton ? null : <Button block={true} type="dashed" style={{ marginTop: '12px' }} onClick={() => add()}>添加一项</Button> }
    </>
  )
})
