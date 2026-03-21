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

const PlayerUpdateInputForm = () => {
  const [player, setPlayer] = useState<PlayerObject | null>(null)
  const [updatedPlayerName, setUpdatedPlayerName] = useState<string>('')
  const [updatedPlayerEmail, setUpdatedPlayerEmail] = useState<string>('')
  const [updatedPlayerDiscordHandle, setUpdatedPlayerDiscordHandle] = useState<string>('')
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
    if (
      (!player.email && !!updatedPlayerEmail) ||
      (!!player.email && !updatedPlayerEmail) ||
      (!!player.email && !!updatedPlayerEmail && player.email != updatedPlayerEmail)
    ) {
      needUpdate = true
    }
    if (
      (!player.discordHandle && !!updatedPlayerDiscordHandle) ||
      (!!player.discordHandle && !updatedPlayerDiscordHandle) ||
      (!!player.discordHandle &&
        !!updatedPlayerDiscordHandle &&
        player.discordHandle != updatedPlayerDiscordHandle)
    ) {
      needUpdate = true
    }
    console.log(
      '!!!',
      needUpdate,
      player,
      updatedPlayerName,
      updatedPlayerEmail,
      updatedPlayerDiscordHandle
    )
    if (!needUpdate) {
      alertWithToast('danger', 'Identical information, no update needed')
      return
    }
    const result = await updatePlayer(
      player.id,
      updatedPlayerName,
      updatedPlayerEmail,
      updatedPlayerDiscordHandle
    )
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      setPlayer({
        ...player,
        name: updatedPlayerName,
        email: updatedPlayerEmail,
        discordHandle: updatedPlayerDiscordHandle
      })
      alertWithToast(
        'success',
        `Updated player (ID=${player.id}) with name = ${updatedPlayerName}, email = ${updatedPlayerEmail}, discord = ${updatedPlayerDiscordHandle}`
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
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
          <span className="text-sm font-medium md:min-w-[100px]">Player</span>
          <div className="flex-1 max-w-sm">
            <PlayerSelect
              selectedPlayer={player}
              onSelectionChange={(player: PlayerObject | null) => {
                setPlayer(player)
                setUpdatedPlayerName(player?.name ?? '')
                setUpdatedPlayerEmail(player?.email ?? '')
                setUpdatedPlayerDiscordHandle(player?.discordHandle ?? '')
              }}
              label=""
              variant="faded"
              showActiveMembership={true}
              showSigninStatus={true}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
          <span className="text-sm font-medium md:min-w-[100px]">Name</span>
          <div className="flex-1 max-w-sm">
            <Input
              className="max-w-xs"
              label=""
              aria-label="Player Name"
              placeholder="Name"
              value={updatedPlayerName}
              onValueChange={setUpdatedPlayerName}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
          <span className="text-sm font-medium md:min-w-[100px]">Email</span>
          <div className="flex-1 max-w-sm">
            <Input
              className="max-w-xs"
              label=""
              aria-label="Player Email"
              placeholder="Email"
              type="email"
              value={updatedPlayerEmail}
              onValueChange={setUpdatedPlayerEmail}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
          <span className="text-sm font-medium md:min-w-[100px]">Discord Handle</span>
          <div className="flex-1 max-w-sm">
            <Input
              className="max-w-xs"
              label=""
              aria-label="Discord Handle"
              placeholder="Discord Handle"
              value={updatedPlayerDiscordHandle}
              onValueChange={setUpdatedPlayerDiscordHandle}
            />
          </div>
        </div>

        <div className="ml-2">
          {(player?.membership ?? [])
            .filter(
              (item) => convertGcpTimestampToDate(item.expire)!.getTime() > new Date().getTime()
            )
            .map((item) => (
              <div>{`${summarizeMembershipStatus(item)}`}</div>
            ))}
        </div>
        <Button
          type="submit"
          color="primary"
          size="sm"
          className="px-6 font-bold"
          isLoading={isSubmitting}
        >
          Update
        </Button>
      </Form>
    </>
  )
}

export default PlayerUpdateInputForm
