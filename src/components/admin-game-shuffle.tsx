import QueueManager from './queue-manager'

const AdminGameShuffle = () => {
  return (
    <div className="w-full">
      <QueueManager
        rulesetId="PHI_LEAGUE"
        pollIntervalMs={3000}
        isAdmin={true}
        signedInOnly={false}
        showRulesetSelect
      />
    </div>
  )
}

export default AdminGameShuffle
