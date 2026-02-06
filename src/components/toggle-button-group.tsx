import { Button, ButtonGroup } from '@heroui/react'
import { type Key } from 'react'

type ToggleButtonGroupProps = {
  options: { id: Key; label: string; labelText?: string }[]
  selectedKeys: Key[]
  onSelectionChange: (key: Key, checked: boolean) => void
  color?: 'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const ToggleButtonGroup = (props: ToggleButtonGroupProps) => {
  const toggleSelection = (key: string) => {
    const checked = !props.selectedKeys.includes(key)
    props.onSelectionChange(key, checked)
  }

  return (
    <div className="w-full">
      <ButtonGroup color={props.color ?? 'primary'} size={props.size ?? 'sm'} variant="flat">
        {props.options.map((opt) => {
          const isActive = props.selectedKeys.includes(opt.id)
          return (
            <Button
              key={opt.id}
              className={`min-w-0 ${isActive ? 'bg-primary text-white' : ''}`}
              onPress={() => toggleSelection(opt.label)}
            >
              {opt.labelText ?? opt.label}
            </Button>
          )
        })}
      </ButtonGroup>
    </div>
  )
}

export default ToggleButtonGroup
