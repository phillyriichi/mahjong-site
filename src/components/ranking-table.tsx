import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Progress,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure
} from '@heroui/react'
import {
  convertGcpTimestampToDate,
  FULL_HISTORY,
  useRanking,
  type RulesetObject,
  type SeasonObject
} from './backend-manager'
import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import PlayerStats from './player-stats'

type RankingTableProps = {
  ruleset: RulesetObject | null | undefined
  season: SeasonObject | null
}

const RankingTable = (props: RankingTableProps) => {
  const { data, isFetching } = useRanking(props.ruleset, props.season)
  const [statsPlayerId, setStatsPlayerId] = useState<number | null>(null)
  const [statsRuleset, setStatsRuleset] = useState<RulesetObject | null>(null)
  const [statsSeason, setStatsSeason] = useState<SeasonObject | null>(null)
  const {
    isOpen: isStatsDrawerOpen,
    onOpen: onStatsDrawerOpen,
    onOpenChange: onStatsDrawerOpenChange
  } = useDisclosure()

  useEffect(() => {
    setStatsRuleset(props.ruleset ?? null)
    setStatsSeason(props.season)
  }, [props.ruleset, props.season])
  // Sort data
  const sortedData = useMemo(() => {
    if (!data) {
      return []
    }
    return Object.values(data).sort((a, b) => b.reducedTotalScore - a.reducedTotalScore)
  }, [data])

  // Season progress bar
  const prorgessBar = useMemo(() => {
    if (!props.season || props.season.id == FULL_HISTORY.id) {
      return <></>
    }
    const msPerDay = 1000 * 60 * 60 * 24
    const now = new Date()
    const start = convertGcpTimestampToDate(props.season.startDate)
    const end = convertGcpTimestampToDate(props.season.endDate)
    // ill-defined season.
    if (!start || !end || now.getTime() < start.getTime()) {
      console.error(`Invalid season: `, props.season, now)
      return <></>
    }
    const totalDays = Math.floor((end.getTime() - start.getTime()) / msPerDay)
    const daysLeft = Math.floor((end.getTime() - now.getTime()) / msPerDay)
    let color: 'primary' | 'warning' | 'danger' | 'success'
    if (daysLeft > 0.5 * totalDays) {
      color = 'primary'
    } else if (daysLeft > 0.15 * totalDays) {
      color = 'warning'
    } else if (daysLeft >= 0) {
      color = 'danger'
    } else {
      color = 'success'
    }
    // The season has finished.
    if (daysLeft < 0) {
      return (
        <Progress
          label={`Finished`}
          minValue={0}
          maxValue={totalDays}
          value={totalDays}
          size="lg"
          color={color}
        />
      )
    }
    // The season is in progress.
    return (
      <Progress
        label={`${daysLeft} days left`}
        minValue={0}
        maxValue={totalDays}
        value={totalDays - daysLeft}
        size="lg"
        color={color}
        className="mb-2"
      />
    )
  }, [props.season])

  const headerColumns = [
    { name: 'Player', allowsSorting: true, className: 'w-[35%]' },
    { name: 'Score', allowsSorting: true, className: 'w-auto' },
    { name: 'Games', allowsSorting: true, className: 'w-[20%]' },
    { name: 'Chombo', allowsSorting: true, className: 'w-[15%]' },
    { name: '', allowsSorting: false, className: 'w-10px' }
  ]

  return (
    <div className="relative w-full">
      {/* Show Spinner when fecthing */}
      {isFetching && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
          <Spinner label="Updating..." color="success" size="lg" />
        </div>
      )}

      <Table
        aria-label="ranking table"
        layout="fixed"
        isStriped
        isVirtualized
        classNames={{
          base: isFetching ? 'opacity-50 transition-opacity' : 'opacity-100 transition-opacity',
          wrapper: 'shadow-md'
        }}
        topContent={prorgessBar}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.name} className={column.className}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={sortedData} emptyContent={!isFetching ? 'No Data' : ' '}>
          {(item) => (
            <TableRow key={item.playerId}>
              <TableCell className="truncate whitespace-nowrap text-sm">{`[${sortedData.indexOf(item) + 1}]${item.playerName}`}</TableCell>
              <TableCell className="text-sm">{item.reducedTotalScore.toFixed(1)}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-0">
                  <span className="text-sm leading-none">{item.totalGames}</span>
                  <span className="text-sm text-default-400 leading-none mt-1">
                    [
                    {Object.values(item.rankingCount).slice(0, props.ruleset?.numPlayers).join('|')}
                    ]
                  </span>
                </div>
              </TableCell>
              <TableCell>{item.totalChombo}</TableCell>
              <TableCell className="w-max-[32px]">
                <Icon
                  icon="mdi:chart-box"
                  className="w-7 h-7"
                  color="green"
                  onClick={() => {
                    setStatsPlayerId(item.playerId)
                    onStatsDrawerOpen()
                  }}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Drawer
        isOpen={isStatsDrawerOpen}
        onOpenChange={onStatsDrawerOpenChange}
        placement="bottom"
        classNames={{ base: 'min-h-[85%]' }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 text-primary">Stats</DrawerHeader>
              <DrawerBody>
                <PlayerStats ruleset={statsRuleset} season={statsSeason} playerId={statsPlayerId} />
              </DrawerBody>
              <DrawerFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default RankingTable
