import { Autocomplete, AutocompleteItem } from '@heroui/react'
import { usePlayers, type PlayerObject } from './backend-manager'
import type { Key } from '@react-types/shared'
import { useEffect, useMemo, useState } from 'react'

type PlayerSelectProps = {
  selectedPlayer: PlayerObject | null | undefined
  onSelectionChange: (value: PlayerObject | null) => void
  className?: string
  signedinOnly?: boolean
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
    return availablePlayers.filter((item) => {
      return props.signedinOnly ? !!item.signedIn : true
    })
  }, [availablePlayers, props.signedinOnly])

  return (
    <Autocomplete
      variant="underlined"
      size="sm"
      className={props.className ?? 'max-w-xs'}
      label="Player"
      isLoading={isPending}
      selectedKey={playerId?.toString() ?? undefined}
      onSelectionChange={(key) => {
        setPlayerId(key)
        const found = filteredPlayers.find((p) => p.id.toString() === key?.toString())
        props.onSelectionChange(found ?? null)
      }}
    >
      {availablePlayers
        ? availablePlayers
            .filter((item) => {
              let rst = true
              if (props.signedinOnly) {
                rst &&= !!item.signedIn
              }
              return rst
            })
            .map((item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>)
        : []}
    </Autocomplete>
  )
}

export default PlayerSelect
