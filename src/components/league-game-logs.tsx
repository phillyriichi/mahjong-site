import { type RulesetObject, type SeasonObject } from './backend-manager'
import GameLogsTable from './game-logs-table'

type LeagueGameLogsProps = {
  ruleset: RulesetObject | null
  season: SeasonObject | null
}

const LeagueGameLogs = (props: LeagueGameLogsProps) => {
  return (
    <div className="w-full">
      <div className="mt-2">
        <GameLogsTable ruleset={props.ruleset} season={props.season} />
      </div>
    </div>
  )
}

export default LeagueGameLogs
