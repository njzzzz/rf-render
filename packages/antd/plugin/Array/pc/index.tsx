import { Context, FormItemBridgeWrapper, defineRfRenderComponent } from '@rf-render/antd'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { Button, Card } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'

function generateUID() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
}
type Value = Record<string, unknown>
type Values = Value[]
// eslint-disable-next-line react-refresh/only-export-components
export default defineRfRenderComponent<'Array'>(({ itemConfig, onChange }) => {
  const { layout = [], name: parentName, props } = itemConfig
  const { form } = useContext(Context)
  const value = form.getFieldValue(parentName) as Values ?? []
  // 维护key
  const valueIdsRef = useRef<WeakMap<Value, string>>(
    value.reduce((map: WeakMap<Value, string>, values) => {
      map.set(values, generateUID())
      return map
    }, new Map()),
  )
  const { Wrapper, marginBottom } = props ?? {}
  // 初始化设置子项值
  useEffect(() => {
    value.forEach((values, index) => {
      valueIdsRef.current.set(values, valueIdsRef.current.get(values) || generateUID())
      layout.forEach(({ name }) => {
        form.setFieldValue(`${parentName}.${index}.${name}`, values[name])
      })
    })
  }, [value])
  const add = () => {
    const newValueItem = {}
    // 生成key
    valueIdsRef.current.set(newValueItem, generateUID())
    onChange([[...value, newValueItem]])
  }
  const children = useMemo(() => value.map((v, index) => {
    const Items = layout.map((item) => {
      const { name, mapKeys, dependOn } = item
      // 处理dependOn映射，以解决数组类型同层依赖
      const mapName = `${parentName}.${index}.${name}`
      const mapDependOn = dependOn?.map((dep) => {
        return `${parentName}.${index}.${dep}`
      })
      return (
        <FormItemBridgeWrapper
          key={mapName}
          itemConfig={{ ...item, name: mapName, dependOn: mapDependOn }}
          onValuesChange={([curValue, ...mapValue]) => {
            const value = form.getFieldValue(parentName) as Values
            // 更新父级表单项值
            onChange([
              value.map((item, vIndex) => {
                if (vIndex === index) {
                  const mapKeysValue = mapKeys?.reduce((acc: Record<string, unknown>, mapKey, index) => {
                    acc[mapKey] = mapValue[index]
                    return acc
                  }, {})
                  const newValue = {
                    ...item,
                    [name]: curValue,
                    ...mapKeysValue,
                  }
                  // 更新key
                  valueIdsRef.current.set(newValue, valueIdsRef.current.get(v) ?? generateUID())
                  return newValue
                }
                return item
              }),
            ])
          }}
          customProps={{
            index,
            parentName,
            name,
            parentConfig: itemConfig,
          }}
        >
        </FormItemBridgeWrapper>
      )
    })

    const remove = (v: Value) => {
      // 生成key
      valueIdsRef.current.delete(v)
      onChange([value.filter(val => val !== v)])
    }
    return (
      Wrapper
        ? (
          <Wrapper add={add} remove={() => remove(v)}>
            {Items}
          </Wrapper>
          )
        : (
          <Card
            key={valueIdsRef.current.get(v)}
            style={{
              marginBottom: marginBottom ?? '24px',
              position: 'relative',
            }}
          >
            {Items}
            {value.length > 1 && (
              <MinusCircleOutlined
                style={{
                  position: 'absolute',
                  color: '#ff4d4f',
                  right: 4,
                  top: '50%',
                  cursor: 'pointer',
                  transform: 'translateY(-50%)',
                }}
                onClick={() => remove(v)}
              />
            )}
          </Card>
          )
    )
  }), [value])
  return (
    <>
      {children}
      {!Wrapper && <Button onClick={add} style={{ width: '100%' }}>新增一项</Button>}
    </>
  )
})
