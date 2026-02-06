import { PageHeader } from '../components/header'
import Page from '../components/page'
import ConstrainedDiv from '../components/constrained-div'
import Section from '../components/section'
import { useLocalStorage } from 'usehooks-ts'

import { Tabs, Tab, Divider } from '@heroui/react'
import LeagueScoreEntry from '../components/league-score-entry'
import LeagueRankings from '../components/league-rankings'
import LeagueGameLogs from '../components/league-game-logs'
import {
  DEFAULT_RULESET_ID,
  type RulesetObject,
  type SeasonObject
} from '../components/backend-manager'
import RulesetSelect from '../components/ruleset-select'
import SeasonSelect from '../components/season-select'

const League = () => {
  const [selectedTab, setSelectedTab] = useLocalStorage<string>(
    'league-selected-tab',
    'league-ranking-tab'
  )
  const [ruleset, setRuleset] = useLocalStorage<RulesetObject | null>(
    'league-ranking-ruleset',
    null
  )
  const [season, setSeason] = useLocalStorage<SeasonObject | null>('league-ranking-season', null)

  const header = (hasSeason: boolean = true) => {
    return (
      <div>
        <div className="flex w-full flex-wrap grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="ml-2">
            <RulesetSelect
              selectedRuleset={ruleset}
              onSelectionChange={setRuleset}
              defaultRulesetId={DEFAULT_RULESET_ID}
            />
          </div>
          {hasSeason ? (
            <div>
              <SeasonSelect
                ruleset={ruleset}
                selectedSeason={season}
                onSelectionChange={setSeason}
                hasFullHistory
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <Page title="PhiLeague - Philly Mah-Jawn Mahjong Club">
        <Section>
          <ConstrainedDiv>
            <PageHeader text="League" />
            <Divider className="my-2" />
            <div className="flex flex-col w-full">
              <Tabs
                aria-label="league-tabs"
                variant="light"
                classNames={{
                  base: 'w-full',
                  tabList: 'w-full justify-around', // 让 Tab 标签本身均匀分布
                  panel: 'w-full pt-10 px-0' // 移除 justify-center，确保 panel 撑满
                }}
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
              >
                <Tab key="league-queue-tab" title="Queue">
                  <div key="league-queue" className="w-full">
                    QUEUE
                  </div>
                </Tab>
                <Tab key="league-score-entry-tab" title="Score Entry">
                  <div key="league-score-entry" className="w-full">
                    {header(/*hasSeason=*/ false)}
                    <LeagueScoreEntry ruleset={ruleset} />
                  </div>
                </Tab>
                <Tab key="league-ranking-tab" title="Ranking">
                  <div key="league-rankings" className="w-full">
                    {header()}
                    <LeagueRankings ruleset={ruleset} season={season} />
                  </div>
                </Tab>
                <Tab key="league-game-logs-tab" title="Game Logs">
                  <div key="league-game-logs" className="w-full">
                    {header()}
                    <LeagueGameLogs ruleset={ruleset} season={season} />
                  </div>
                </Tab>
              </Tabs>
              <Divider className="mt-2 mb-8" />
            </div>
          </ConstrainedDiv>
        </Section>
      </Page>
    </>
  )
}

export default League
