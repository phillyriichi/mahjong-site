import { Autocomplete, AutocompleteItem, Chip } from '@heroui/react'
import {
  MembershipType,
  MembershipTypeText,
  resolveMembership,
  usePlayers,
  type PlayerObject
} from './backend-manager'
import type { Key } from '@react-types/shared'
import { useEffect, useMemo, useState } from 'react'

type PlayerSelectProps = {
  selectedPlayer: PlayerObject | null | undefined
  onSelectionChange: (value: PlayerObject | null) => void
  className?: string
  signedinOnly?: boolean
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  labelPlacement?: 'inside' | 'outside' | 'outside-left' | 'outside-top'
  showSigninStatus?: boolean
  showActiveMembership?: boolean
  placeholder?: string
}

const PlayerSelect = (props: PlayerSelectProps) => {
  const [playerId, setPlayerId] = useState<Key | null>(
    props.selectedPlayer ? props.selectedPlayer.id : null
  )

  const selectedPlayerActiveMembershipType = useMemo(() => {
    return resolveMembership(props.selectedPlayer ?? null).type
  }, [props.selectedPlayer])

  useEffect(() => {
    if (props.selectedPlayer) {
      setPlayerId(props.selectedPlayer.id)
    } else {
      setPlayerId(null)
    }
  }, [props.selectedPlayer])

  const { data: availablePlayers, isPending } = usePlayers()

  const sortedPlayers = useMemo(() => {
    if (!availablePlayers) return []
    return Object.values(availablePlayers).toSorted((a, b) => {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    })
  }, [availablePlayers, props.signedinOnly])

  const filteredPlayers = useMemo(() => {
    if (!sortedPlayers) return []
    return sortedPlayers.filter((item) => {
      return props.signedinOnly ? !!item.signedIn : true
    })
  }, [sortedPlayers])

  return (
    <Autocomplete
      variant={props.variant ?? 'underlined'}
      size={props.size ?? 'sm'}
      className={props.className ?? 'max-w-xs'}
      label={props.label ?? 'Player'}
      labelPlacement={props.labelPlacement ?? 'inside'}
      isLoading={isPending}
      selectedKey={playerId?.toString() ?? undefined}
      placeholder={props.placeholder ?? ''}
      onSelectionChange={(key) => {
        setPlayerId(key)
        const found = filteredPlayers.find((p) => p.id.toString() === key?.toString())
        props.onSelectionChange(found ?? null)
      }}
      startContent={
        <>
          {props.showActiveMembership && props.selectedPlayer && (
            <Chip
              size="sm"
              color={
                selectedPlayerActiveMembershipType == MembershipType.MANGAN
                  ? 'warning'
                  : selectedPlayerActiveMembershipType == MembershipType.TANYAO
                    ? 'primary'
                    : 'default'
              }
            >
              {MembershipTypeText[selectedPlayerActiveMembershipType]}
            </Chip>
          )}
          {props.showSigninStatus && props.selectedPlayer?.signedIn && (
            <Chip size="sm" color="success">
              Signed In
            </Chip>
          )}
        </>
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
