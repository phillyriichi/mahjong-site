import QueueManager from './queue-manager'

export default function LegaueSelfQueue() {
  return <QueueManager pollIntervalMs={3000} isAdmin={false} signedInOnly={true} />
}
