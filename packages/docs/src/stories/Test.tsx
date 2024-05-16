import { forwardRef, useImperativeHandle, useRef } from 'react'

const CompWithRef = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    alert() {
      // eslint-disable-next-line no-alert
      alert(1)
    },
  }))
  return <div>qqqqq</div>
})

export default function Test() {
  const ref = useRef()
  return (
    <div onClick={() => {
      ref.current!.alert()
    }}
    >
      <CompWithRef
        ref={ref}
      >
      </CompWithRef>
    </div>

  )
}
