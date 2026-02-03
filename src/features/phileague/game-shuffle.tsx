import { PageHeader } from '../../components/header'
import Page from '../../components/page'
import QueueButtonGroup from '../../components/queue-button-group'

const GameShuffle = () => {
  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <PageHeader text="Game Shuffle" />

      <QueueButtonGroup />
    </Page>
  )
}

export default GameShuffle
