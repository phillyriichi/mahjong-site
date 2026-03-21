import QueueManager from './queue-manager'

export default function LegaueSelfQueue() {
  return <QueueManager pollIntervalMs={2000} isAdmin={false} signedInOnly={true} />
}
