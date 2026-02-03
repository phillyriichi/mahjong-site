import type { Key } from '@react-types/shared'
import { useRulesets, type RulesetObject } from './backend-manager'
import BaseSingleSelect from './base-single-select'
import { useEffect, useMemo } from 'react'

type RulesetSelectProps = {
  selectedRuleset: RulesetObject | null | undefined
  onSelectionChange: (value: RulesetObject | null) => void
  defaultRulesetId?: Key | null | undefined
  className?: string
}

const RulesetSelect = (props: RulesetSelectProps) => {
  const { data: availableRulesets, isPending } = useRulesets()
  const items = useMemo(() => {
    return availableRulesets?.map((item) => ({ ...item, selectText: item.name })) ?? []
  }, [availableRulesets])

  // Initialize ruleset when loading the page.
  useEffect(() => {
    if (!props.selectedRuleset && items && items.length > 0) {
      const found = props.defaultRulesetId
        ? items.find((item) => item.id === props.defaultRulesetId)
        : null
      const defaultItem = found ?? items[0]
      props.onSelectionChange({
        ...defaultItem
      })
    }
  }, [items, props.selectedRuleset])

  return (
    <BaseSingleSelect
      label="Ruleset"
      className={props.className ?? undefined}
      availableItems={items}
      isLoading={isPending}
      selectedKey={props.selectedRuleset?.id || ''}
      onSelectionChange={(key: Key) => {
        const found = items.find((item) => item.id === key)
        props.onSelectionChange(found || null)
      }}
    />
  )
}

export default RulesetSelect
