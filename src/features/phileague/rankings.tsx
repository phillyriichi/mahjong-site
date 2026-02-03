import { useState } from 'react'
import {
  DEFAULT_RULESET_ID,
  type RulesetObject,
  type SeasonObject
} from '../../components/backend-manager'
import { PageHeader } from '../../components/header'
import Page from '../../components/page'
import RankingTable from '../../components/ranking-table'
import RulesetSelect from '../../components/ruleset-select'
import SeasonSelect from '../../components/season-select'

const Rankings = () => {
  const [ruleset, setRuleset] = useState<RulesetObject | null>(null)
  const [season, setSeason] = useState<SeasonObject | null>(null)

  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <PageHeader text="Rankings" />

      <div className="flex w-full flex-wrap grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="ml-2">
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
      </div>

      <div className="mt-2">
        <RankingTable ruleset={ruleset} season={season} />
      </div>
    </Page>
  )
}

export default Rankings
