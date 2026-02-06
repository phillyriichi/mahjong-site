import { Autocomplete, AutocompleteItem, Chip } from '@heroui/react'
import { usePlayers, type PlayerObject } from './backend-manager'
import type { Key } from '@react-types/shared'
import { useEffect, useMemo, useState } from 'react'

type PlayerSelectProps = {
  selectedPlayer: PlayerObject | null | undefined
  onSelectionChange: (value: PlayerObject | null) => void
  className?: string
  signedinOnly?: boolean
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  label?: string
  labelPlacement?: 'inside' | 'outside' | 'outside-left' | 'outside-top'
  showSigninStatus?: boolean
}

const PlayerSelect = (props: PlayerSelectProps) => {
  const [playerId, setPlayerId] = useState<Key | null>(
    props.selectedPlayer ? props.selectedPlayer.id : null
  )

  useEffect(() => {
    if (props.selectedPlayer) {
      setPlayerId(props.selectedPlayer.id)
    } else {
      setPlayerId(null)
    }
  }, [props.selectedPlayer])

  const { data: availablePlayers, isPending } = usePlayers()

  const filteredPlayers = useMemo(() => {
    if (!availablePlayers) return []
    return Object.values(availablePlayers).filter((item) => {
      return props.signedinOnly ? !!item.signedIn : true
    })
  }, [availablePlayers, props.signedinOnly])

  return (
    <Autocomplete
      variant={props.variant ?? 'underlined'}
      size="sm"
      className={props.className ?? 'max-w-xs'}
      label={props.label ?? 'Player'}
      labelPlacement={props.labelPlacement ?? 'inside'}
      isLoading={isPending}
      selectedKey={playerId?.toString() ?? undefined}
      onSelectionChange={(key) => {
        setPlayerId(key)
        const found = filteredPlayers.find((p) => p.id.toString() === key?.toString())
        props.onSelectionChange(found ?? null)
      }}
      endContent={
        props.showSigninStatus &&
        props.selectedPlayer?.signedIn && (
          <Chip size="sm" color="success">
            {' '}
            Signed In
          </Chip>
        )
      }
    >
      {filteredPlayers &&
        filteredPlayers
          .filter((item) => {
            let rst = true
            if (props.signedinOnly) {
              rst &&= !!item.signedIn
            }
            return rst
          })
          .map((item) => (
            <AutocompleteItem
              key={item.id}
              endContent={
                props.showSigninStatus &&
                item?.signedIn && (
                  <Chip size="sm" color="success">
                    {' '}
                    Signed In
                  </Chip>
                )
              }
            >
              {item.name}
            </AutocompleteItem>
          ))}
    </Autocomplete>
  )
}

export default PlayerSelect
