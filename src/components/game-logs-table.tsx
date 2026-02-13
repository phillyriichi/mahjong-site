import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  useDisclosure,
  Chip
} from '@heroui/react'
import {
  convertGcpTimestampToDate,
  DEFAULT_GAME_LOG,
  deleteGameLog,
  formatDate,
  useGameLogs,
  usePlayers,
  type GameLog,
  type PlayerObject,
  type RulesetObject,
  type SeasonObject
} from './backend-manager'
import { useEffect, useMemo, useState, type Key } from 'react'
import { Icon } from '@iconify/react'
import useConfirm from './confirm-modal'
import { useQueryClient } from '@tanstack/react-query'
import GameLogEditModal from './game-log-edit-modal'
import { useAdminAuth } from './useAdminAuth'
import PlayerSelect from './player-select'

type GameLogsTableProps = {
  ruleset: RulesetObject | null | undefined
  season: SeasonObject | null
}

const GameLogsTable = (props: GameLogsTableProps) => {
  const [playerFilter, setPlayerFilter] = useState<PlayerObject | null>()
  const queryClient = useQueryClient()
  const { ask, ConfirmModal } = useConfirm()
  const { data: availablePlayers, isPending: availablePlayersIsPending } = usePlayers()
  const { data, isFetching } = useGameLogs(props.ruleset, props.season, null, {
    enabled: !!props.ruleset?.id && !!props.season && !availablePlayersIsPending
  })
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange
  } = useDisclosure()
  const { isAdmin } = useAdminAuth()
  const [editModalGameLog, setEditModalGameLog] = useState<GameLog>(DEFAULT_GAME_LOG)
  // process -- The logs are already sorted by timestamp. we need to convert log object to an array form 1st to 4th
  const processedData = useMemo(() => {
    if (!data || availablePlayersIsPending) {
      return []
    }
    return data.games
      .filter((log: GameLog) => {
        if (!playerFilter) {
          return true
        }
        return Object.keys(log.players).includes(String(playerFilter.id))
      })
      .map((log: GameLog) => {
        return {
          id: log.id,
          timestamp: log.timestamp,
          players: Object.keys(log.players)
            .map((playerId: string) => {
              return {
                ...log.players[Number(playerId)],
                id: playerId,
                name: availablePlayers![Number(playerId)].name
              }
            })
            .toSorted((a, b) => {
              return a.totalScore > b.totalScore ? -1 : 1
            })
        }
      })
  }, [data, playerFilter])

  // Clean up edit modal game log whenever ruleset/season/player is updated.
  useEffect(() => {
    setEditModalGameLog(DEFAULT_GAME_LOG)
  }, [props.ruleset, props.season, playerFilter])

  const topContent = useMemo(() => {
    return (
      <div className="w-full flex items-center mb-2">
        <div className="max-w-[50%]">
          <PlayerSelect
            selectedPlayer={playerFilter}
            onSelectionChange={setPlayerFilter}
            label="Player Filter"
          />
        </div>
        <div className="ml-2">
          <Chip>Count: {processedData.length}</Chip>
        </div>
      </div>
    )
  }, [processedData.length, playerFilter])

  const columns: { name: string; align: 'start' | 'center' | 'end'; adminOnly: boolean }[] = [
    { name: 'Date', align: 'start', adminOnly: false },
    { name: 'Results', align: 'center', adminOnly: false },
    { name: 'Admin', align: 'center', adminOnly: true }
  ]

  const headerColumns = useMemo(() => {
    return columns.filter((col) => !col.adminOnly || isAdmin)
  }, [isAdmin])

  const renderTableCell = (log: GameLog, columnKey: Key) => {
    if (columnKey == 'Date') {
      return (
        <TableCell className="text-left p-1 text-xs lg:text-md max-w-[60px] lg:max-w-[160px]">
          {formatDate(log.timestamp, /*short=*/ true)}
        </TableCell>
      )
    }
    if (columnKey == 'Results') {
      return (
        <TableCell>
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 min-w-[240px]`}>
            {log.players.map((p) => (
              <div key={p.id} className="flex justify-between items-center text-tiny">
                <span className="truncate max-w-[100px] text-default-600">{p.name}</span>
                <div className="flex items-center gap-1">
                  <span
                    className={`font-mono font-semibold ${
                      p.totalScore >= 0 ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {Number(p.score).toFixed(0)}
                  </span>

                  {p.chombo > 0 && (
                    <span className="text-warning text-[10px]">{'©'.repeat(p.chombo)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TableCell>
      )
    }
    if (columnKey == 'Admin') {
      return (
        <TableCell>
          <div className="flex items-center justify-center gap-0">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="primary"
              onPress={() => {
                setEditModalGameLog({ ...log })
                onEditModalOpen()
              }}
            >
              <Icon icon="material-symbols:edit" height={20} width={20} />
            </Button>

            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={async () => {
                if (
                  await ask({
                    title: `Sure delete game ${log.id}?`,
                    messages: [
                      convertGcpTimestampToDate(log.timestamp)?.toLocaleString('en-US') ?? ''
                    ].concat(
                      log.players.map(
                        (p) => `${p.name}: ${p.score} ${p.chombo ? `(chombo: ${p.chombo})` : ''}`
                      )
                    ),
                    confirmText: 'Delete',
                    type: 'danger'
                  })
                ) {
                  await deleteGameLog(props.ruleset!.id, log.id)
                  queryClient.invalidateQueries({
                    queryKey: ['gameLogs', props.ruleset?.id, props.season?.id, null]
                  })
                }
              }}
            >
              <Icon icon="material-symbols:delete" height={20} width={20} />
            </Button>
          </div>
        </TableCell>
      )
    }
    return <TableCell>Invalid columnKey {columnKey}</TableCell>
  }

  return (
    <div className="relative w-full">
      {/* Show Spinner when fecthing */}
      {isFetching && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
          <Spinner label="Updating..." color="success" size="lg" />
        </div>
      )}

      <Table
        aria-label="game logs table"
        topContent={topContent}
        isStriped
        isCompact
        isVirtualized
        classNames={{
          base: isFetching ? 'opacity-50 transition-opacity' : 'opacity-100 transition-opacity',
          wrapper: 'shadow-md'
        }}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.name} align={column.align}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={processedData} emptyContent={!isFetching ? 'No Data' : ' '}>
          {(log: GameLog) => (
            <TableRow key={log.id}>{(columnKey) => renderTableCell(log, columnKey)}</TableRow>
          )}
        </TableBody>
      </Table>

      <GameLogEditModal
        log={editModalGameLog}
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalOpenChange}
      />
      <ConfirmModal />
    </div>
  )
}

export default GameLogsTable
