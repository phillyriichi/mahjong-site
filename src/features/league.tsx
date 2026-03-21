import { PageHeader } from '../components/header'
import Page from '../components/page'
import ConstrainedDiv from '../components/constrained-div'
import Section from '../components/section'
import { Tabs, Tab, Divider } from '@heroui/react'
import LeagueScoreEntry from '../components/league-score-entry'
import LeagueRankings from '../components/league-rankings'
import LeagueGameLogs from '../components/league-game-logs'
import { type RulesetObject, type SeasonObject } from '../components/backend-manager'
import RulesetSelect from '../components/ruleset-select'
import SeasonSelect from '../components/season-select'
import LegaueSelfQueue from '../components/league-self-queue'
import { useEffect, useState } from 'react'
import { useSearchParams, useParams } from 'wouter'
import useLocalStorageWithTTL from '../components/use-local-storage-with-ttl'

const AVAILABLE_TABS: { [key: string]: string } = {
  ['queue']: 'league-queue-tab',
  ['score-entry']: 'league-score-entry-tab',
  ['ranking']: 'league-ranking-tab',
  ['game-logs']: 'league-game-logs-tab'
}

const League = () => {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const [selectedTab, setSelectedTab] = useLocalStorageWithTTL<string>(
    'league-tab',
    params.tab && AVAILABLE_TABS[params.tab]
      ? AVAILABLE_TABS[params.tab]
      : AVAILABLE_TABS['ranking']
  )
  const [ruleset, setRuleset] = useState<RulesetObject | null>(null)
  const [season, setSeason] = useState<SeasonObject | null>(null)

  // enforce tab if it is in params
  useEffect(() => {
    if (params.tab && params.tab in AVAILABLE_TABS) {
      setSelectedTab(AVAILABLE_TABS[params.tab])
    }
  }, [params.tab])

  const header = (hasSeason: boolean = true) => {
    return (
      <div>
        <div className="flex w-full flex-wrap grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="ml-2">
            <RulesetSelect
              selectedRuleset={ruleset}
              onSelectionChange={setRuleset}
              defaultRulesetId={searchParams.get('ruleset')}
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
                  tabList: 'w-full justify-around',
                  panel: 'w-full pt-10 px-0'
                }}
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
              >
                <Tab key="league-queue-tab" title="Queue">
                  <div key="league-queue" className="w-full">
                    <LegaueSelfQueue />
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
