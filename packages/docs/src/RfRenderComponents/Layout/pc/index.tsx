import { FormItemBridgeWrapper } from '@rf-render/antd'
import { FormItemBridgeProps } from '@rf-render/core'
import { Col, ColProps, Row, RowProps } from 'antd'
import { ReactElement } from 'react'

export interface CustomerLayout {
  // 一行几个
  span?: number
  rowProps?: RowProps
  colProps?: ColProps
}
/**
 * 布局组件
 */
export default function Layout(props: FormItemBridgeProps & CustomerLayout) {
  const { rfrender, span = 2, rowProps, colProps } = props
  const { dependOnMaps, form, item, formName } = rfrender
  const { layout = [] } = item
  const getRows = () => {
    if (!layout.length) {
      return null
    }
    let index = 0
    return layout.reduce((acc: ReactElement[][], item) => {
      const stack: ReactElement[] = acc[index] ?? []
      const col = (
        <Col key={item.name} {...(colProps ?? {})}>
          <FormItemBridgeWrapper {...item} dependOnMaps={dependOnMaps} form={form} formName={formName}></FormItemBridgeWrapper>
        </Col>
      )
      acc[index] = [...stack, col]
      if (acc[index].length % span === 0) {
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
