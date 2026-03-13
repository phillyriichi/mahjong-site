import { useQueryClient } from '@tanstack/react-query'
import {
  alertWithToast,
  COLORS,
  convertGcpTimestampToDate,
  postSchedudledGamesToDiscord,
  resetScheudledGames,
  usePlayers,
  useScheduledGames,
  type RulesetObject
} from './backend-manager'
import useConfirm from './confirm-modal'
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@heroui/react'
import { useMemo } from 'react'

type ScheduledGamesManagerProps = {
  ruleset: RulesetObject | null | undefined
}

export default function ScheduledGamesManager(props: ScheduledGamesManagerProps) {
  const { data: scheduledGames, isFetching } = useScheduledGames(props.ruleset?.id)
  const { data: availablePlayers } = usePlayers()
  const { ask, ConfirmModal } = useConfirm()
  const queryClient = useQueryClient()

  const topContent = scheduledGames && (
    <div className="my-3">
      <div>
        <Chip color="default">{scheduledGames.ruleset}</Chip>
        <Chip className="ml-2" color="default">
          {convertGcpTimestampToDate(scheduledGames.timestamp)?.toLocaleString()}
        </Chip>
      </div>
    </div>
  )

  const headerColumns = useMemo(() => {
    const cols = [{ name: 'Scheduled Games', className: '', key: 'ScheduledGames' }]
    if (!props.ruleset) {
      return cols
    }
    for (let i = 1; i <= props.ruleset.numPlayers; ++i) {
      cols.push({
        name: '',
        className: '',
        key: `Player${i}`
      })
    }
    return cols
  }, [props.ruleset])

  const aggregatedData = useMemo(() => {
    if (!scheduledGames || !props.ruleset) {
      return []
    }
    const rst = [...scheduledGames.games]
    if (scheduledGames.observers && scheduledGames.observers.length > 0) {
      rst.push({
        players: [...scheduledGames.observers].concat(
          Array(props.ruleset.numPlayers - scheduledGames.observers.length).fill(null)
        ),
        type: 'Observer',
        table: -99
      })
    }
    return rst
  }, [scheduledGames, props.ruleset])

  return (
    <div className="w-full">
      {scheduledGames && availablePlayers && (
        <div>
          <div>
            <Table
              aria-label="scheudled games table"
              layout="auto"
              isStriped
              classNames={{
                base: isFetching
                  ? 'opacity-50 transition-opacity'
                  : 'opacity-100 transition-opacity',
                wrapper: 'shadow-md'
              }}
              topContent={topContent}
            >
              <TableHeader columns={headerColumns}>
                {(column) => (
                  <TableColumn key={column.key} className={column.className}>
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={aggregatedData} emptyContent={!isFetching ? 'No Data' : ' '}>
                {(item: any) => (
                  <TableRow key={item.table}>
                    <TableCell>
                      <Chip
                        className="min-w-[50px] touch-none text-sm"
                        style={{
                          backgroundColor: `${COLORS[item.type]}20`,
                          color: COLORS[item.type]
                        }}
                      >
                        {item.type}
                      </Chip>
                    </TableCell>
                    {item.players.map((p: string) => {
                      return <TableCell>{availablePlayers[Number(p)]?.name ?? ''}</TableCell>
                    })}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-row items-end gap-2 mt-3">
            <Button
              color="primary"
              className="px-3 font-bold ml-1"
              onPress={async () => {
                if (!props.ruleset) {
                  return
                }
                if (!aggregatedData || aggregatedData.length == 0) {
                  alertWithToast(`warning`, ``, `No Game to Post`)
                  return
                }
                if (
                  await ask({
                    title: `Sure to post to discord?`,
                    messages: [],
                    confirmText: 'Confirm',
                    type: 'primary'
                  })
                ) {
                  const rst = await postSchedudledGamesToDiscord(props.ruleset.id)
                  if (rst.success) {
                    alertWithToast(
                      'success',
                      'The queue and games will be reset in 15min.',
                      'Posted to Discord'
                    )
                  } else {
                    alertWithToast('danger', rst.message)
                  }
                }
              }}
            >
              Post to Discord
            </Button>
            <Button
              color="danger"
              className="px-3 font-bold ml-1"
              onPress={async () => {
                if (!props.ruleset) {
                  return
                }
                if (
                  await ask({
                    title: `Sure to reset [${props.ruleset?.name}] games?`,
                    messages: [],
                    confirmText: 'Reset',
                    type: 'danger'
                  })
                ) {
                  await resetScheudledGames(props.ruleset.id)
                  queryClient.invalidateQueries({ queryKey: ['scheduledGames', props.ruleset.id] })
                }
              }}
            >
              {' '}
              Reset Games{' '}
            </Button>
            <ConfirmModal />
          </div>
        </div>
      )}
    </div>
  )
}
