import { PageHeader } from '../../components/header'
import Page from '../../components/page'
import LeagueRankings from '../../components/league-rankings'

const Rankings = () => {
  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <PageHeader text="Rankings" />
      <LeagueRankings />
    </Page>
  )
}

export default Rankings
