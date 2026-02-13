import { Form } from '@heroui/form'
import {
  alertWithToast,
  assignWinner,
  convertGcpTimestampToDate,
  type PlayerObject,
  type RulesetObject,
  type SeasonObject
} from './backend-manager'
import RankingTable from './ranking-table'
import { useState } from 'react'
import PlayerSelect from './player-select'
import { Button } from '@heroui/button'
import { useAdminAuth } from './useAdminAuth'
import { Divider } from '@heroui/divider'
import { useQueryClient } from '@tanstack/react-query'

type LeagueRankingsProps = {
  ruleset: RulesetObject | null
  season: SeasonObject | null
}

const LeagueRankings = (props: LeagueRankingsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [winner, setWinner] = useState<PlayerObject | null>(null)
  const { isAdmin } = useAdminAuth()
  const queryClient = useQueryClient()
  const handleSubmit = async () => {
    const { success, msg } = await assignWinner(props.ruleset?.id, props.season?.id, winner?.id)
    if (!success) {
      alertWithToast('danger', msg)
    } else {
      // refresh
      queryClient.invalidateQueries({ queryKey: ['rulesets'] })
      if (!winner) {
        // we are removing the assigned winner
        alertWithToast('success', `Removed previously assigned winner.`)
      } else {
        // we are assigning a new winner
        alertWithToast(
          'success',
          `Assigned ${winner?.name} as winner for ${props.ruleset?.name}, ${props.season?.name}`
        )
      }
    }
  }

  return (
    <div className="w-full">
      <div className="mt-2">
        <RankingTable ruleset={props.ruleset} season={props.season} />
      </div>
      {isAdmin &&
        props.season &&
        convertGcpTimestampToDate(props.season?.endDate)!.getTime() < new Date().getTime() && (
          <div className="w-full">
            <Divider className="my-3" />
            <div className='flex items-center gap-x-1"'>
              <Form
                className="flex gap-4 w-full"
                key="winner-assignment--form"
                onSubmit={async (e) => {
                  // prevent default behavior of refreshing the page.
                  e.preventDefault()
                  setIsSubmitting(true)
                  await handleSubmit()
                  setIsSubmitting(false)
                }}
              >
                <div className="flex-1 max-w-[50%]">
                  <PlayerSelect
                    selectedPlayer={winner}
                    onSelectionChange={setWinner}
                    label="Assign Season Winner"
                  />
                </div>
                <Button
                  type="submit"
                  color="primary"
                  size="sm"
                  className="px-6 font-bold"
                  isLoading={isSubmitting}
                >
                  Assign
                </Button>
              </Form>
            </div>
          </div>
        )}
    </div>
  )
}

export default LeagueRankings
