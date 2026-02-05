import { PageHeader } from '../../components/header'
import Page from '../../components/page'
import PhiLeagueScoreEntry from '../../components/league-score-entry'

const ScoreEntry = () => {
  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <PageHeader text="Score Entry" />
      <PhiLeagueScoreEntry />
    </Page>
  )
}

export default ScoreEntry
