import QueueManager from './queue-manager'

export default function LegaueSelfQueue() {
  return (
    <QueueManager
      rulesetId="PHI_LEAGUE"
      pollIntervalMs={3000}
      isAdmin={false}
      signedInOnly={true}
    />
  )
}
