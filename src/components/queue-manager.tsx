import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Droppable } from './draggable'
import { Draggable } from './droppable'
import { Button, Chip, Form } from '@heroui/react'
import {
  aggregateQueueLabels,
  alertWithToast,
  dequeuePlayer,
  enqueuePlayer,
  type PlayerObject,
  QueueType,
  resolveQueueLabels,
  usePlayers,
  useQueuedPlayers
} from './backend-manager'
import { useEffect, useState } from 'react'
import PlayerSelect from './player-select'
import QueueButtonGroup from './queue-button-group'
import { Icon } from '@iconify/react'

const COLORS = {
  [QueueType.LEAGUE]: '#eb984e',
  [QueueType.FLEXIBLE]: '#5dade2',
  [QueueType.CASUAL]: '#16a085',
  [QueueType.STAFF]: '#566573',
  [QueueType.BREAK]: '#c90076'
}

const QUEUES = {
  [QueueType.LEAGUE]: {
    id: QueueType.LEAGUE,
    title: QueueType.LEAGUE,
    adminOnly: false,
    color: COLORS[QueueType.LEAGUE]
  },
  [QueueType.FLEXIBLE]: {
    id: QueueType.FLEXIBLE,
    title: QueueType.FLEXIBLE,
    adminOnly: false,
    color: COLORS[QueueType.FLEXIBLE]
  },
  [QueueType.CASUAL]: {
    id: QueueType.CASUAL,
    title: QueueType.CASUAL,
    adminOnly: false,
    color: COLORS[QueueType.CASUAL]
  },
  [QueueType.STAFF]: {
    id: QueueType.STAFF,
    title: QueueType.STAFF,
    adminOnly: true,
    color: COLORS[QueueType.STAFF]
  },
  [QueueType.BREAK]: {
    id: QueueType.BREAK,
    title: QueueType.BREAK,
    adminOnly: true,
    color: COLORS[QueueType.BREAK]
  }
}

type QueueManagerProps = {
  rulesetId: string
  pollIntervalMs: number
  backgroundPollIntervalMs?: number
  signedInOnly?: boolean
  isAdmin?: boolean
}

export default function QueueManager(props: QueueManagerProps) {
  const { data: queuedPlayers } = useQueuedPlayers(props.rulesetId, props.pollIntervalMs)
  const { data: players } = usePlayers()
  const [items, setItems] = useState<{ [key: string]: PlayerObject[] }>({
    League: [],
    Flexible: [],
    Casual: [],
    Staff: [],
    Break: []
  })
  const [prioritized, setPrioritized] = useState<number[]>([])

  useEffect(() => {
    if (!players || !queuedPlayers) {
      return
    }
    const newItems: { [key: string]: PlayerObject[] } = {
      League: [],
      Flexible: [],
      Casual: [],
      Staff: [],
      Break: []
    }
    Object.entries(queuedPlayers).forEach(([playerId, item]: any) => {
      const aggregated = aggregateQueueLabels(item.labels)
      if (aggregated in newItems) {
        newItems[aggregated].push(players[playerId])
      }
    })
    setItems(newItems)
  }, [queuedPlayers, players])

  // Make DND work with both desktop and mobile.
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
        distance: 5
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
        distance: 5
      }
    })
  )

  // Used to sort players in a queue
  const playerSorterFn = (a: PlayerObject, b: PlayerObject) => {
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
  }

  const handleQueueChange = async (
    player: PlayerObject,
    from: string | null,
    to: string | null
  ) => {
    // No-op
    if (from == to) {
      return
    }
    // Dequeue a player
    if (to == null && from != null) {
      dequeuePlayer(player.id, props.rulesetId)
      setItems((prev) => ({
        ...prev,
        [from]: prev[from].filter((p: PlayerObject) => p.id !== player.id)
      }))
      return
    }
    // Add a new player
    if (from == null && to != null) {
      enqueuePlayer(player.id, props.rulesetId, resolveQueueLabels(to as QueueType))
      setItems((prev) => ({
        ...prev,
        [to]: [...prev[to], player].toSorted(playerSorterFn)
      }))
      return
    }
    // Change queue for a player
    if (from != null && to != null) {
      enqueuePlayer(player.id, props.rulesetId, resolveQueueLabels(to as QueueType))
      setItems((prev) => ({
        ...prev,
        [from]: prev[from].filter((p: PlayerObject) => p.id !== player.id),
        [to]: [...prev[to], { ...player }].toSorted(playerSorterFn)
      }))
    }
  }

  const findContainer = (playerId: number) => {
    for (let [container, players] of Object.entries(items)) {
      const found = players.find((p) => p.id == playerId)
      if (found) {
        return {
          container: container,
          player: found
        }
      }
    }
    return {
      container: null,
      player: null
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return
    const activeId = active.id
    const to = over.id == 'Trash' ? null : over.id
    const { container: from, player: foundPlayer } = findContainer(activeId)
    if (from) {
      handleQueueChange(foundPlayer, from, to)
    }
  }

  const [player, setPlayer] = useState<PlayerObject | null>(null)
  const [queue, setQueue] = useState<QueueType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (action: string) => {
    if (!player) {
      alertWithToast('danger', `Invalid Player ${player}`)
      return
    }
    if (action == 'enqueue') {
      if (!queue) {
        alertWithToast('danger', `Invalid Queue ${queue}`)
        return
      }
      const to = queue
      const { container: from } = findContainer(player.id)
      handleQueueChange(player, from, to)
    } else if (action == 'dequeue') {
      const { container: from } = findContainer(player.id)
      const to = null
      handleQueueChange(player, from, to)
    }
  }

  return (
    <div className="w-full">
      <Form
        className="flex gap-4 w-full"
        key="self-queue-form"
        onSubmit={async (e) => {
          // prevent default behavior of refreshing the page.
          e.preventDefault()
          const submitter = (e.nativeEvent as any).submitter
          const action = submitter instanceof HTMLButtonElement ? submitter.name : ''
          setIsSubmitting(true)
          await handleSubmit(action)
          setIsSubmitting(false)
        }}
      >
        <div className="flex gap-1 max-w-[50%]">
          <PlayerSelect
            selectedPlayer={player}
            onSelectionChange={setPlayer}
            signedinOnly={props.signedInOnly}
          />
        </div>
        <div className="flex flex-row items-end gap-2">
          <div className="flex-shrink-0">
            <QueueButtonGroup queue={queue} setQueue={setQueue} />
          </div>
          <Button
            type="submit"
            name="enqueue"
            size="sm"
            color="primary"
            className="px-1 font-bold ml-1"
            isLoading={isSubmitting}
          >
            Enqueue
          </Button>
          {props.isAdmin && (
            <Button
              type="submit"
              name="dequeue"
              size="sm"
              color="danger"
              className="px-1 font-bold ml-1"
              isLoading={isSubmitting}
            >
              Dequeue
            </Button>
          )}
        </div>
      </Form>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {Object.values(QUEUES)
          .filter((q) => !q.adminOnly)
          .map((queue) => {
            const containerId = `${queue.id}`
            return (
              <Droppable key={containerId} id={containerId}>
                <div className="w-full min-h-[120px] px-3 py-2 bg-content1 shadow-medium rounded-2xl border border-white/20 mt-3 transition-all">
                  <h3 className="text-lg font-bold" style={{ color: queue.color }}>
                    {queue.title}({items[containerId].length})
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {items[containerId].map((p) => (
                      <Draggable key={p.id} id={String(p.id)}>
                        <Chip
                          className="min-w-[50px] touch-none text-sm"
                          style={{ backgroundColor: `${queue.color}20`, color: queue.color }}
                          endContent={
                            props.isAdmin && (
                              <Chip
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => {
                                  if (prioritized.includes(p.id)) {
                                    setPrioritized((prev) => prev.filter((x) => x != p.id))
                                  } else {
                                    setPrioritized((prev) => [...prev, p.id])
                                  }
                                }}
                                color={prioritized.includes(p.id) ? 'danger' : 'default'}
                              >
                                Pri
                              </Chip>
                            )
                          }
                        >
                          {p.name}
                        </Chip>
                      </Draggable>
                    ))}
                  </div>
                </div>
              </Droppable>
            )
          })}
        <div className="grid grid-cols-2 gap-2 w-full">
          {props.isAdmin &&
            Object.values(QUEUES)
              .filter((q) => q.adminOnly)
              .map((queue) => {
                const containerId = `${queue.id}`
                return (
                  <Droppable key={containerId} id={containerId}>
                    <div className="min-h-[120px] px-3 py-2 bg-content1 shadow-medium rounded-2xl border border-white/20 mt-3 transition-all">
                      <h3 className="text-lg font-bold" style={{ color: queue.color }}>
                        {queue.title}({items[containerId].length})
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {items[containerId].map((p) => (
                          <Draggable key={p.id} id={String(p.id)}>
                            <Chip
                              className="min-w-[50px] touch-none text-sm"
                              style={{ backgroundColor: `${queue.color}20`, color: queue.color }}
                              endContent={
                                props.isAdmin && (
                                  <Chip
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => {
                                      if (prioritized.includes(p.id)) {
                                        setPrioritized((prev) => prev.filter((x) => x != p.id))
                                      } else {
                                        setPrioritized((prev) => [...prev, p.id])
                                      }
                                    }}
                                    color={prioritized.includes(p.id) ? 'danger' : 'default'}
                                  >
                                    Pri
                                  </Chip>
                                )
                              }
                            >
                              {p.name}
                            </Chip>
                          </Draggable>
                        ))}
                      </div>
                    </div>
                  </Droppable>
                )
              })}
        </div>
        {props.isAdmin && (
          <div className="grid grid-cols-1 w-full">
            <Droppable key='Trash' id='Trash'>
              <div className="w-full min-h-[80px] px-3 py-4 bg-danger-50 dark:bg-danger-50/10 shadow-medium rounded-2xl border border-danger/30 mt-3 transition-all flex items-center justify-center gap-2">
                <Icon 
                  icon="material-symbols:delete" 
                  height={24} 
                  width={24} 
                  className="text-danger" 
                />
                <span className="font-bold text-danger">Drop here to dequeue</span>
              </div>
            </Droppable>
          </div>
        )}
      </DndContext>
    </div>
  )
}
