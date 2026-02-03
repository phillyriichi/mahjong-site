import { useState } from 'react'
import Page from '../../components/page'
import {
  DEFAULT_RULESET_ID,
  type PlayerObject,
  type RulesetObject,
  type SeasonObject
} from '../../components/backend-manager'
import PlayerSelect from '../../components/player-select'
import RulesetSelect from '../../components/ruleset-select'
import SeasonSelect from '../../components/season-select'
import GameLogsTable from '../../components/game-logs-table'

const GameLogs = () => {
  const [ruleset, setRuleset] = useState<RulesetObject | null>()
  const [season, setSeason] = useState<SeasonObject | null>(null)
  const [player, setPlayer] = useState<PlayerObject | null>()

  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <div className="flex w-full flex-wrap grid grid-cols-3 lg:grid-cols-4 gap-2 px-2">
        <div>
          <RulesetSelect
            selectedRuleset={ruleset}
            onSelectionChange={setRuleset}
            defaultRulesetId={DEFAULT_RULESET_ID}
          />
        </div>

        <div>
          <SeasonSelect
            ruleset={ruleset}
            selectedSeason={season}
            onSelectionChange={setSeason}
            hasFullHistory
          />
        </div>

        <div>
          <PlayerSelect selectedPlayer={player} onSelectionChange={setPlayer} />
        </div>
      </div>

      <div className="mt-6">
        <GameLogsTable ruleset={ruleset} season={season} player={player} />
      </div>
    </Page>
  )
}

export default GameLogs
