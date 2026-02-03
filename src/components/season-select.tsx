import type { Key } from '@react-types/shared'
import {
  convertGcpTimestampToDate,
  FULL_HISTORY,
  type RulesetObject,
  type SeasonObject
} from './backend-manager'
import BaseSingleSelect from './base-single-select'
import { useEffect, useMemo } from 'react'

type SeasonSelectProps = {
  ruleset: RulesetObject | null | undefined
  selectedSeason: SeasonObject | null | undefined
  onSelectionChange: (value: SeasonObject | null) => void
  hasFullHistory?: boolean
  className?: string
}

function resolveAvailableSeasons(
  ruleset: RulesetObject | null | undefined,
  hasFullHistory: boolean
): SeasonObject[] {
  let availableSeasons: SeasonObject[] = []
  if (ruleset && ruleset.seasons) {
    const now = new Date()
    availableSeasons = Object.values(ruleset.seasons)
      .filter((item) => {
        const startDate = convertGcpTimestampToDate(item.startDate)
        return startDate && startDate.getTime() <= now.getTime()
      })
      .toSorted((a, b) => {
        const startTimeA = convertGcpTimestampToDate(a.startDate)
        const startTimeB = convertGcpTimestampToDate(b.startDate)
        return startTimeA && startTimeB && startTimeA.getTime() <= startTimeB.getTime() ? 1 : -1
      })
      .map((item: SeasonObject) => {
        item.selectText = `${item.id}: ${item.name}`
        return item
      })
  }
  if (hasFullHistory) {
    availableSeasons.unshift(FULL_HISTORY)
  }
  return availableSeasons
}

function resolveDefaultSeasonId(availableSeasons: SeasonObject[]): Key {
  if (!availableSeasons || availableSeasons.length == 0) {
    return ''
  }
  // Return first non-FULL_HISTORY season ID if available, otherwise return FULL_HISTORY id.
  if (availableSeasons[0].id != FULL_HISTORY.id) {
    return availableSeasons[0].id
  }
  return availableSeasons.length > 1 ? availableSeasons[1].id : FULL_HISTORY.id
}

const SeasonSelect = (props: SeasonSelectProps) => {
  const availableSeasons = useMemo(() => {
    return resolveAvailableSeasons(props.ruleset, !!props.hasFullHistory)
  }, [props.ruleset, props.hasFullHistory])

  useEffect(() => {
    const defaultSeasonId = resolveDefaultSeasonId(availableSeasons)
    const found = availableSeasons.find((item) => item.id === defaultSeasonId)
    props.onSelectionChange(found || null)
  }, [availableSeasons])

  return (
    <BaseSingleSelect
      label="Season"
      className={props.className ?? undefined}
      isLoading={false}
      availableItems={availableSeasons}
      selectedKey={props.selectedSeason?.id || ''}
      onSelectionChange={(key: Key) => {
        const found = availableSeasons.find((item) => item.id === key)
        props.onSelectionChange(found || null)
      }}
    />
  )
}

export default SeasonSelect
