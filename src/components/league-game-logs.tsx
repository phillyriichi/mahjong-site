import { useState } from 'react'
import { type PlayerObject, type RulesetObject, type SeasonObject } from './backend-manager'
import PlayerSelect from './player-select'
import GameLogsTable from './game-logs-table'

type LeagueGameLogsProps = {
  ruleset: RulesetObject | null
  season: SeasonObject | null
}

const LeagueGameLogs = (props: LeagueGameLogsProps) => {
  const [player, setPlayer] = useState<PlayerObject | null>()

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 px-2 mb-4">
        <PlayerSelect selectedPlayer={player} onSelectionChange={setPlayer} />
      </div>

      <div className="mt-2">
        <GameLogsTable ruleset={props.ruleset} season={props.season} player={player} />
      </div>
    </div>
  )
}

export default LeagueGameLogs
