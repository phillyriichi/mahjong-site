import QueueManager from './queue-manager'

type AdminGameShuffleProps = {}

const AdminGameShuffle = (props: AdminGameShuffleProps) => {
  return (
    <div className="w-full">
      <QueueManager
        rulesetId="PHI_LEAGUE"
        pollIntervalMs={3000}
        isAdmin={true}
        signedInOnly={false}
      />
    </div>
  )
}

export default AdminGameShuffle
