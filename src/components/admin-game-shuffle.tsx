import QueueManager from './queue-manager'
import DividerWithText from './divider-with-text'
import {
  convertGcpTimestampToDate,
  QUEUE_COLORS,
  QueueType,
  usePlayers,
  useRulesets,
  useScheduledGames
} from './backend-manager'
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

const AdminGameShuffle = () => {
  const { data: scheduledGames, isFetching } = useScheduledGames('TEST')
  const { data: availableRulesets } = useRulesets()
  const { data: availablePlayers } = usePlayers()

  const ruleset = useMemo(() => {
    if (!availableRulesets || !scheduledGames?.ruleset) {
      return null
    }
    return availableRulesets.find((item) => item.id == scheduledGames.ruleset)
  }, [availableRulesets, scheduledGames?.ruleset])

  const numPlayers = useMemo(() => {
    return ruleset?.numPlayers ?? 0
  }, [ruleset])

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
    const cols = [{ name: 'Scheduled Games', className: '' }]
    for (let i = 1; i <= numPlayers; ++i) {
      cols.push({
        name: '',
        className: ''
      })
    }
    return cols
  }, [numPlayers])

  const aggregatedData = useMemo(() => {
    if (!scheduledGames) {
      return []
    }
    const rst = [...scheduledGames.games]
    if (scheduledGames.observers) {
      rst.push({
        players: [...scheduledGames.observers].concat(
          Array(numPlayers - scheduledGames.observers.length).fill(null)
        ),
        type: 'Observer',
        table: -99
      })
    }
    return rst
  }, [scheduledGames, numPlayers])

  return (
    <div className="w-full">
      <QueueManager
        rulesetId="PHI_LEAGUE"
        pollIntervalMs={3000}
        isAdmin={true}
        signedInOnly={false}
        showRulesetSelect
      />

      <DividerWithText className="flex items-center w-full my-2" text={'Scheduled Games'} />
      {scheduledGames && availablePlayers && (
        <div>
          <Table
            aria-label="scheudled games table"
            layout="auto"
            isStriped
            classNames={{
              base: isFetching ? 'opacity-50 transition-opacity' : 'opacity-100 transition-opacity',
              wrapper: 'shadow-md'
            }}
            topContent={topContent}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn key={column.name} className={column.className}>
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
                        backgroundColor: `${QUEUE_COLORS[item.type as QueueType]}20`,
                        color: QUEUE_COLORS[item.type as QueueType]
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
      )}
      <div className="flex flex-row items-end gap-2 mt-3">
        <Button color="primary" className="px-3 font-bold ml-1">
          {' '}
          Post to Discord{' '}
        </Button>
        <Button color="danger" className="px-3 font-bold ml-1">
          {' '}
          Reset Games{' '}
        </Button>
      </div>
    </div>
  )
}

export default AdminGameShuffle
