import { Select, SelectItem, type SharedSelection } from '@heroui/react'
import type { Key } from '@react-types/shared'
import { useMemo } from 'react'

/**
 * Base single selection component.
 * heroUI select compoenent only support multiple selection key types.
 * */

type Item = {
  id: string | number | null
  selectText?: string | null
  [key: string]: unknown
}

type BaseSingleSelectProps = {
  availableItems: Item[]
  selectedKey: Key
  onSelectionChange: (key: Key) => void
  label: string
  isLoading: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const BaseSingleSelect = (props: BaseSingleSelectProps) => {
  const handleSelectionChange = (values: SharedSelection) => {
    if (values instanceof Set) {
      const selectedValue = Array.from(values)[0]
      props.onSelectionChange(selectedValue)
    } else {
      console.error('BaseSingleSelect: got invalid values', values)
    }
  }

  return (
    <Select
      className={props.className ?? 'max-w-xs'}
      label={props.label}
      isLoading={props.isLoading}
      selectedKeys={useMemo(() => {
        return props.availableItems.some((s) => s.id === props.selectedKey)
          ? [props.selectedKey]
          : []
      }, [props.selectedKey, props.availableItems])}
      onSelectionChange={handleSelectionChange}
      selectionMode="single"
      disallowEmptySelection={true}
      variant="underlined"
      size={props.size ?? 'sm'}
    >
      {props.availableItems
        ? props.availableItems.map((item) => (
            <SelectItem key={item.id}>{item.selectText}</SelectItem>
          ))
        : []}
    </Select>
  )
}

export default BaseSingleSelect
