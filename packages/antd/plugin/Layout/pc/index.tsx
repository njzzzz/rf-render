import { CustomerLayout, FormItemBridgeWrapper } from '@rf-render/antd'
import { FormItemBridgeProps } from '@rf-render/core'
import { Col, FormInstance, Row } from 'antd'
import { ReactElement } from 'react'

/**
 * 布局组件
 */
export default function Layout(props: FormItemBridgeProps<FormInstance> & CustomerLayout) {
  const { rfrender, span = 2, rowProps, colProps } = props
  const { depsExec, form, item } = rfrender
  const { layout = [], display = true } = item
  if (!display) {
    return null
  }
  const getRows = () => {
    if (!layout.length) {
      return null
    }
    let index = 0
    return layout.reduce((acc: ReactElement[][], item, currentIndex: number) => {
      const stack: ReactElement[] = acc[index] ?? []
      const { name, colProps: itemColProps, display = true } = item
      if (display) {
        const col = (
          <Col key={name || currentIndex} {...(itemColProps ?? (colProps ?? {}))}>
            <FormItemBridgeWrapper {...item} depsExec={depsExec} form={form}></FormItemBridgeWrapper>
          </Col>
        )
        acc[index] = [...stack, col]
      }
      const len = acc[index]?.length
      if (len && (len % span === 0)) {
        index++
      }
      return acc
    }, [])
  }
  const Rows = getRows() ?? []
  return (
    <>
      {
        Rows.map((cols, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={index} gutter={24} {...(rowProps ?? {})}>
              {cols}
            </Row>
          )
        })
      }
    </>
  )
}
