import { Spinner } from '@heroui/spinner'
import {
  ActivityType,
  ActivityTypeText,
  formatDate,
  formatTime,
  revertActivityLog,
  useActivityLogs,
  usePlayers,
  type ActivityLogData,
  type PlayerObject,
  type PlayersMap
} from './backend-manager'
import { CalendarDate } from '@internationalized/date'
import { useEffect, useMemo, useState, type Key } from 'react'
import { Icon } from '@iconify/react'
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
import BaseSingleSelect from './base-single-select'
import PlayerSelect from './player-select'
import { useQueryClient } from '@tanstack/react-query'
import useConfirm from './confirm-modal'

type ActivityLogsTableProps = {
  start: CalendarDate
  end: CalendarDate
  actionCount: number
  setActionCount: (value: React.SetStateAction<number>) => void
}

function createPaymentSummary(log: ActivityLogData): string {
  if (log && log.payment) {
    if (!!log.payment.price) {
      return `${log.payment.type} $${log.payment.price}`
    } else {
      return `${log.payment.type}`
    }
  }
  return ''
}

function renderActivityTableCell(log: ActivityLogData, players: PlayersMap | null | undefined) {
  if (log && players) {
    if (log.activity == ActivityType.SIGN_IN) {
      return (
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
          {/* 姓名和动作 */}
          <span className="text-small font-medium text-default-700 whitespace-nowrap">
            {`${players[log.playerId]?.name} signed in`}
          </span>
          {/* 辅助信息（大屏幕会自动排在右边） */}
          <span className="text-tiny text-default-600">
            {`${log.currentMembership}, ${createPaymentSummary(log)}`}
          </span>
        </div>
      )
    } else if (log.activity == ActivityType.MEMBERSHIP) {
      return (
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
          {/* 姓名和获得的会员 */}
          <span className="text-small font-medium text-blue-400 whitespace-nowrap">
            {`${players[log.playerId]?.name} obtained [${log!.newMembership!.type}]`}
          </span>
          {/* 到期和支付信息 */}
          <span className="text-tiny text-default-400">
            {`expiring ${formatDate(log!.newMembership!.expire)}, ${createPaymentSummary(log)}`}
          </span>
        </div>
      )
    }
  }
  return <></>
}

const ActivityLogsTable = (props: ActivityLogsTableProps) => {
  const { ask, ConfirmModal } = useConfirm()
  const availableActivityFilters = [{ id: 'ALL', selectText: 'All' }].concat(
    Object.entries(ActivityTypeText).map(([key, val]) => {
      return { id: key, selectText: val }
    })
  )
  const [activityFilter, setActivityFilter] = useState(availableActivityFilters[0])
  const [playerFilter, setPlayerFilter] = useState<PlayerObject | null>()
  const { data: players, isFetching: isPlayersFetching } = usePlayers()
  const { data: activityLogs, isFetching: isActivityLogsFecthing } = useActivityLogs(
    props.start,
    props.end
  )
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['activityLogs', props.start, props.end] })
  }, [props.actionCount])

  const filteredActiveityLogs = useMemo(() => {
    if (!activityLogs) {
      return []
    }
    return activityLogs.filter((item) => {
      if (activityFilter.id != 'ALL' && activityFilter.id != item.activity) {
        return false
      }
      if (playerFilter && item.playerId != playerFilter.id) {
        return false
      }
      return true
    })
  }, [activityLogs, activityFilter, playerFilter])

  const topContent = () => {
    return (
      <div>
        <div className="w-full row flex">
          <BaseSingleSelect
            className="max-w-[200px]"
            label="Activity Filter"
            availableItems={availableActivityFilters}
            isLoading={false}
            selectedKey={activityFilter.id}
            onSelectionChange={(key: Key) => {
              const found = availableActivityFilters.find((item) => item.id === key)
              if (found) {
                setActivityFilter({ ...found })
              } else {
                setActivityFilter({ ...availableActivityFilters[0] })
              }
            }}
          />
          <PlayerSelect
            className="max-w-[200px] ml-2"
            label="Player Filter"
            selectedPlayer={playerFilter}
            onSelectionChange={setPlayerFilter}
          />
          <Chip variant="flat" className="mt-3 ml-2">
            Count: {filteredActiveityLogs.length}
          </Chip>
        </div>
      </div>
    )
  }

  if (isPlayersFetching || isActivityLogsFecthing) {
    return (
      <div className="w-full overflow-x-auto mt-3 flex justify-center">
        <Spinner label="Loading Activities..." color="success" size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto mt-3 min-h-[400px]">
      <Table
        aria-label="admin-player-profile-table"
        layout="fixed"
        isStriped
        isVirtualized
        topContent={topContent()}
        classNames={{
          base: 'max-w-full'
        }}
      >
        <TableHeader>
          <TableColumn width={80} style={{ width: window.innerWidth > 768 ? '300px' : '80px' }}>
            Timestamp
          </TableColumn>
          <TableColumn> Activity </TableColumn>
          <TableColumn
            width={60}
            align="center"
            style={{ width: window.innerWidth > 768 ? '100px' : '60px' }}
          >
            Op
          </TableColumn>
        </TableHeader>

        <TableBody items={filteredActiveityLogs}>
          {(log) => (
            <TableRow key={`activity-log-${log.id}`}>
              <TableCell className="whitespace-nowrap">
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 leading-tight">
                  <span className="text-[11px] text-default-700">{formatDate(log.timestamp)}</span>
                  <span className="text-[10px] font-medium text-default-400">
                    {formatTime(log.timestamp)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-1">{renderActivityTableCell(log, players)}</TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={async () => {
                    if (
                      await ask({
                        title: `Sure to revert log?`,
                        messages: [
                          `[${players![log.playerId]?.name}] [${log.activity}] [${log.payment.type} $${log.payment.price}]`
                        ],
                        confirmText: 'Revert',
                        type: 'danger'
                      })
                    ) {
                      await revertActivityLog(log.id)
                      props.setActionCount(props.actionCount + 1) // trigger refresh
                    }
                  }}
                >
                  <Icon icon="grommet-icons:revert" height={20} width={20} />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ConfirmModal />
    </div>
  )
}

export default ActivityLogsTable
