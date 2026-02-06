import { type Key } from 'react'
import ToggleButtonGroup from './toggle-button-group'
import { QueueType } from './backend-manager'

type QueueButtonGroupProps = {
  queue: QueueType | null
  setQueue: (queue: QueueType | null) => void
  allowUnselect?: boolean
}

const QueueButtonGroup = (props: QueueButtonGroupProps) => {
  const options = Object.values(QueueType).map((item) => {
    return { id: item, label: item }
  })
  return (
    <div className="w-full">
      <ToggleButtonGroup
        options={options}
        selectedKeys={props.queue ? [props.queue] : []}
        onSelectionChange={(queue: Key, checked: boolean) => {
          if (checked) {
            if (!queue || queue != props.queue) {
              props.setQueue(queue as QueueType)
            }
          } else if (props.allowUnselect) {
            if (queue == props.queue) {
              props.setQueue(null)
            }
          }
        }}
      />
    </div>
  )
}

export default QueueButtonGroup
