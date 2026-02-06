import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Input } from '@heroui/react'
import { useState } from 'react'
import PlayerSelect from './player-select'
import {
  alertWithToast,
  convertGcpTimestampToDate,
  summarizeMembershipStatus,
  updatePlayer,
  type PlayerObject
} from './backend-manager'
import { useQueryClient } from '@tanstack/react-query'

type PlayerUpdateInputFormProps = {
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
}

const PlayerUpdateInputForm = (props: PlayerUpdateInputFormProps) => {
  const [player, setPlayer] = useState<PlayerObject | null>(null)
  const [updatedPlayerName, setUpdatedPlayerName] = useState<string>('')
  const [updatedPlayerEmail, setUpdatedPlayerEmail] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async () => {
    if (!player) {
      alertWithToast('danger', 'No Player Selected')
      return
    }
    let needUpdate = false
    if (player.name != updatedPlayerName) {
      needUpdate = true
    }
    if (!!player.email && !!updatedPlayerEmail && player.email != updatedPlayerEmail) {
      needUpdate = true
    }
    if (!needUpdate) {
      alertWithToast('danger', 'Identical information, no update needed')
      return
    }
    const result = await updatePlayer(player.id, updatedPlayerName, updatedPlayerEmail)
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      setPlayer({
        ...player,
        name: updatedPlayerName,
        email: updatedPlayerEmail
      })
      alertWithToast(
        'success',
        `Updated player (ID=${player.id}) with ${updatedPlayerName}, ${updatedPlayerEmail}`
      )
    } else {
      alertWithToast('danger', result.message)
    }
  }

  return (
    <>
      <Form
        className="flex gap-4 w-full"
        key="player-update-input-form"
        onSubmit={async (e) => {
          // prevent default behavior of refreshing the page.
          e.preventDefault()
          setIsSubmitting(true)
          await handleSubmit()
          setIsSubmitting(false)
        }}
      >
        <PlayerSelect
          selectedPlayer={player}
          onSelectionChange={(player: PlayerObject | null) => {
            setPlayer(player)
            setUpdatedPlayerName(player?.name ?? '')
            setUpdatedPlayerEmail(player?.email ?? '')
          }}
          label="Player"
          variant={props.variant ?? 'bordered'}
        />
        <Input
          className="max-w-xs"
          label="Updated Name"
          variant={props.variant ?? 'bordered'}
          value={updatedPlayerName}
          onValueChange={setUpdatedPlayerName}
        />
        <Input
          className="max-w-xs"
          label="Updated Email"
          type="email"
          variant={props.variant ?? 'bordered'}
          value={updatedPlayerEmail}
          onValueChange={setUpdatedPlayerEmail}
        />

        <div className="ml-2">
          {(player?.membership ?? [])
            .filter(
              (item) => convertGcpTimestampToDate(item.expire)!.getTime() > new Date().getTime()
            )
            .map((item) => (
              <div>{`${summarizeMembershipStatus(item)}`}</div>
            ))}
        </div>
        <Button type="submit" color="primary" className="px-6 font-bold" isLoading={isSubmitting}>
          Update
        </Button>
      </Form>
    </>
  )
}

export default PlayerUpdateInputForm
