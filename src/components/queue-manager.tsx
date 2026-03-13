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
  COLORS,
  QueueType,
  resolveQueueLabels,
  type RulesetObject,
  usePlayers,
  useQueuedPlayers,
  resetQueue,
  startNewShuffle
} from './backend-manager'
import { useEffect, useState } from 'react'
import PlayerSelect from './player-select'
import QueueButtonGroup from './queue-button-group'
import { Icon } from '@iconify/react'
import RulesetSelect from './ruleset-select'
import useConfirm from './confirm-modal'
import { useQueryClient } from '@tanstack/react-query'

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
  pollIntervalMs: number
  backgroundPollIntervalMs?: number
  signedInOnly?: boolean
  isAdmin?: boolean
  showRulesetSelect?: boolean
  onRulesetChange?: (value: RulesetObject | null) => void
}

export default function QueueManager(props: QueueManagerProps) {
  const [ruleset, setRuleset] = useState<RulesetObject | null>(null)
  const [player, setPlayer] = useState<PlayerObject | null>(null)
  const [queue, setQueue] = useState<QueueType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: queuedPlayers } = useQueuedPlayers(ruleset?.id, props.pollIntervalMs)
  const { data: players } = usePlayers()
  const [items, setItems] = useState<{ [key: string]: PlayerObject[] }>({
    League: [],
    Flexible: [],
    Casual: [],
    Staff: [],
    Break: []
  })
  const [prioritized, setPrioritized] = useState<number[]>([])

  const { ask, ConfirmModal } = useConfirm()
  const queryClient = useQueryClient()

  const generateQueueFromItems = (items: { [key: string]: PlayerObject[] }) => {
    const generatedQueue: { [key: string]: any } = {}
    let nonBreakPlayers: number = 0
    Object.entries(items).forEach(([queue, players]) => {
      players.forEach((p) => {
        generatedQueue[p.id] = {
          playerId: p.id,
          playerName: p.name,
          labels: { League: false, Casual: false, Staff: false, Break: false }
        }
        if (queue == 'League') {
          generatedQueue[p.id].labels.League = true
          nonBreakPlayers += 1
        } else if (queue == 'Flexible') {
          generatedQueue[p.id].labels.League = true
          generatedQueue[p.id].labels.Casual = true
          nonBreakPlayers += 1
        } else if (queue == 'Casual') {
          generatedQueue[p.id].labels.Casual = true
          nonBreakPlayers += 1
        } else if (queue == 'Staff') {
          generatedQueue[p.id].labels.Staff = true
          nonBreakPlayers += 1
        } else if (queue == 'Break') {
          generatedQueue[p.id].labels.Break = true
        }
      })
    })
    return {
      generatedQueue: generatedQueue,
      nonBreakPlayers: nonBreakPlayers
    }
  }

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
    if (!ruleset || from == to) {
      return
    }
    // Dequeue a player
    if (to == null && from != null) {
      dequeuePlayer(player.id, ruleset.id)
      setItems((prev) => ({
        ...prev,
        [from]: prev[from].filter((p: PlayerObject) => p.id !== player.id)
      }))
      return
    }
    // Add a new player
    if (from == null && to != null) {
      enqueuePlayer(player.id, ruleset.id, resolveQueueLabels(to as QueueType))
      setItems((prev) => ({
        ...prev,
        [to]: [...prev[to], player].toSorted(playerSorterFn)
      }))
      return
    }
    // Change queue for a player
    if (from != null && to != null) {
      enqueuePlayer(player.id, ruleset.id, resolveQueueLabels(to as QueueType))
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
        <div className="w-full flex gap-2">
          <div className="flex-1 max-w-[50%]">
            <PlayerSelect
              selectedPlayer={player}
              onSelectionChange={setPlayer}
              signedinOnly={props.signedInOnly}
            />
          </div>
          {props.showRulesetSelect && (
            <div className="flex-1 max-w-[50%]">
              <RulesetSelect
                selectedRuleset={ruleset}
                onSelectionChange={(ruleset) => {
                  setRuleset(ruleset)
                  if (props.onRulesetChange) {
                    props.onRulesetChange(ruleset)
                  }
                }}
                showAdmin
              />
            </div>
          )}
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
        <div className="grid grid-cols-2 gap-2">
          {Object.values(QUEUES)
            .filter((q) => !q.adminOnly)
            .map((queue) => {
              const containerId = `${queue.id}`
              return (
                <div className={queue.id == QueueType.LEAGUE ? 'col-span-2' : 'col-span-1'}>
                  <Droppable key={containerId} id={containerId}>
                    <div className="w-full min-h-[120px] px-3 py-2 bg-content1 shadow-medium rounded-2xl border border-white/20 mt-2 transition-all">
                      <h3 className="text-lg font-bold" style={{ color: queue.color }}>
                        {queue.title}({items[containerId].length})
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
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
                </div>
              )
            })}
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          {props.isAdmin &&
            Object.values(QUEUES)
              .filter((q) => q.adminOnly)
              .map((queue) => {
                const containerId = `${queue.id}`
                return (
                  <Droppable key={containerId} id={containerId}>
                    <div className="min-h-[120px] px-3 py-2 bg-content1 shadow-medium rounded-2xl border border-white/20 mt-2 transition-all">
                      <h3 className="text-lg font-bold" style={{ color: queue.color }}>
                        {queue.title}({items[containerId].length})
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
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
            <Droppable key="Trash" id="Trash">
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
      {props.isAdmin && (
        <div className="flex flex-row items-end gap-2 mt-3">
          <Button
            color="primary"
            className="px-3 font-bold ml-1"
            onPress={async () => {
              if (!ruleset || !players) {
                return
              }
              const { generatedQueue, nonBreakPlayers } = generateQueueFromItems(items)
              if (nonBreakPlayers < ruleset.numPlayers) {
                alertWithToast(
                  'warning',
                  `Needs at least ${ruleset.numPlayers} non-break players`,
                  `Insufficient players`
                )
                return
              }
              await startNewShuffle(ruleset.id, generatedQueue, prioritized, 'FULLY_RANDOM')
              queryClient.invalidateQueries({ queryKey: ['scheduledGames', ruleset.id] })
              alertWithToast('success', ``, `Games scheduled.`)
            }}
          >
            Start New Shuffle
          </Button>
          <Button
            color="danger"
            className="px-3 font-bold ml-1"
            onPress={async () => {
              if (
                await ask({
                  title: `Sure to reset [${ruleset?.name}] queue?`,
                  messages: [],
                  confirmText: 'Reset',
                  type: 'danger'
                })
              ) {
                if (!ruleset) {
                  return
                }
                await resetQueue(ruleset.id)
                queryClient.invalidateQueries({ queryKey: ['queuedPlayers', ruleset.id] })
              }
            }}
          >
            Reset Queue
          </Button>
          <ConfirmModal />
        </div>
      )}
    </div>
  )
}
