import { type RulesetObject, type SeasonObject } from './backend-manager'
import RankingTable from './ranking-table'

type LeagueRankingsProps = {
  ruleset: RulesetObject | null
  season: SeasonObject | null
}

const LeagueRankings = (props: LeagueRankingsProps) => {
  return (
    <div className="w-full">
      <div className="mt-2">
        <RankingTable ruleset={props.ruleset} season={props.season} />
      </div>
    </div>
  )
}

export default LeagueRankings
