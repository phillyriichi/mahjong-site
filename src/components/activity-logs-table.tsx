import { Spinner } from '@heroui/spinner'
import {
  ActivityType,
  ActivityTypeText,
  formatDate,
  formatDateTime,
  useActivityLogs,
  type ActivityLogData,
  type PlayerObject
} from './backend-manager'
import { CalendarDate } from '@internationalized/date'
import { useMemo, useState, type Key } from 'react'
import { Icon } from '@iconify/react'
import {
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

type ActivityLogsTableProps = {
  start: CalendarDate
  end: CalendarDate
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

function renderActivityTableCell(log: ActivityLogData) {
  if (log) {
    if (log.activity == ActivityType.SIGN_IN) {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-small font-medium text-default-700">
            {`${log.playerId} signed in`}
          </span>
          <span className="text-tiny text-default-600">
            {`${log.currentMembership}, ${createPaymentSummary(log)}`}
          </span>
        </div>
      )
    } else if (log.activity == ActivityType.MEMBERSHIP) {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-small font-medium text-blue-400">
            {`${log.playerId} obtained [${log!.newMembership!.type}]`}
          </span>
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
  const availableActivityFilters = [{ id: 'ALL', selectText: 'All' }].concat(
    Object.entries(ActivityTypeText).map(([key, val]) => {
      return { id: key, selectText: val }
    })
  )
  const [activityFilter, setActivityFilter] = useState(availableActivityFilters[0])
  const [playerFilter, setPlayerFilter] = useState<PlayerObject | null>()

  const { data: activityLogs, isFetching } = useActivityLogs(props.start, props.end)
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
            className="max-w-[40%] max-w-[200px]"
            label="Activity"
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
            className="max-w-[40%] max-w-[200px] ml-2"
            selectedPlayer={playerFilter}
            onSelectionChange={setPlayerFilter}
          />
        </div>
        <div className="w-full row flex my-2">
          <Chip color="default">Count: {filteredActiveityLogs.length}</Chip>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto mt-3 min-h-[400px]">
      {/* Show Spinner when fecthing */}
      {isFetching && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
          <Spinner label="Updating..." color="success" size="lg" />
        </div>
      )}

      <Table
        aria-label="admin-player-profile-table"
        layout="auto"
        isStriped
        isVirtualized
        topContent={topContent()}
        classNames={{
          base: 'max-w-full'
        }}
      >
        <TableHeader>
          <TableColumn> Timestamp </TableColumn>
          <TableColumn> Activity </TableColumn>
          <TableColumn> Operation </TableColumn>
        </TableHeader>

        <TableBody items={filteredActiveityLogs}>
          {(log) => (
            <TableRow key={`activity-log-${log.id}`}>
              <TableCell className="whitespace-nowrap">{formatDateTime(log.timestamp)}</TableCell>
              <TableCell className="py-1">{renderActivityTableCell(log)}</TableCell>
              <TableCell>
                <button
                  className="p-2 hover:bg-default-100 rounded-full"
                  onClick={() => console.log('!!! clicked on ', log.id)}
                >
                  <Icon icon="material-symbols:delete" className="w-6 h-6" color="red" />
                </button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ActivityLogsTable
