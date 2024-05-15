import { Input } from 'antd'

export default function Test(props: any) {
  const { onChange, onMapKeysChange, ..._ } = props
  return (
    <Input
      {..._}
      onChange={(e) => {
        onChange(e.target.value)
        onMapKeysChange(['this is first mapKeys value'])
      }}
    />
  )
}
