import QueueManager from './queue-manager'
import DividerWithText from './divider-with-text'
import { type RulesetObject } from './backend-manager'
import { useState } from 'react'
import ScheduledGamesManager from './scheduled-games-manager'

const AdminGameShuffle = () => {
  const [ruleset, setRuleset] = useState<RulesetObject | null>(null)

  return (
    <div className="w-full">
      <QueueManager
        pollIntervalMs={2000}
        isAdmin={true}
        signedInOnly={false}
        showRulesetSelect
        onRulesetChange={(ruleset: RulesetObject | null) => {
          setRuleset(ruleset)
        }}
      />

      <DividerWithText className="flex items-center w-full my-2" text={'Scheduled Games'} />

      <ScheduledGamesManager ruleset={ruleset} />
    </div>
  )
}

export default AdminGameShuffle
