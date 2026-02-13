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
  useDisclosure,
  Input
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
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    setStatsRuleset(props.ruleset ?? null)
    setStatsSeason(props.season)
  }, [props.ruleset, props.season])
  // Sorted data
  const sortedData = useMemo(() => {
    if (!data) {
      return []
    }
    const sorted = Object.values(data).sort((a, b) => b.reducedTotalScore - a.reducedTotalScore)
    for (let i = 0; i < sorted.length; ++i) {
      sorted[i].rank = i + 1
      if (props.season?.winner && props.season.winner == sorted[i].playerId) {
        sorted[i].isWinner = true
      }
    }
    return sorted
  }, [data, props.season])
  // filter
  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      if (!!searchFilter) {
        return item.playerName.toLowerCase().includes(searchFilter.toLowerCase())
      }
      return true
    })
  }, [sortedData, searchFilter])

  // Season progress bar
  const prorgessBar = useMemo(() => {
    if (!props.season || props.season.id == FULL_HISTORY.id) {
      return { bar: <></>, label: '' }
    }
    const msPerDay = 1000 * 60 * 60 * 24
    const now = new Date()
    const start = convertGcpTimestampToDate(props.season.startDate)
    const end = convertGcpTimestampToDate(props.season.endDate)
    // ill-defined season.
    if (!start || !end || now.getTime() < start.getTime()) {
      console.error(`Invalid season: `, props.season, now)
      return { bar: <></>, label: '' }
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
      return {
        bar: (
          <Progress minValue={0} maxValue={totalDays} value={totalDays} size="lg" color={color} />
        ),
        label: `Finished`
      }
    }
    // The season is in progress.
    return {
      bar: (
        <Progress
          minValue={0}
          maxValue={totalDays}
          value={totalDays - daysLeft}
          size="lg"
          color={color}
        />
      ),
      label: `${daysLeft} days left`
    }
  }, [props.season])

  const searchInput = useMemo(() => {
    return (
      <Input
        isClearable
        className="w-full"
        placeholder="Search Player"
        size="sm"
        startContent={<Icon icon="material-symbols:search" />}
        onClear={() => {
          setSearchFilter('')
        }}
        onValueChange={setSearchFilter}
      />
    )
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className="w-full flex flex-col sm:flex-row sm:items-center gap-6 py-4">
        <div className="flex items-center gap-4 flex-[8] min-w-0">
          <span className="whitespace-nowrap font-bold text-slate-700">{prorgessBar.label}</span>
          <div className="flex-1">{prorgessBar.bar}</div>
        </div>

        <div className="flex-[2] min-w-[200px]">{searchInput}</div>
      </div>
    )
  }, [prorgessBar, searchInput])

  const headerColumns = [
    { name: 'Player', allowsSorting: true, className: 'w-[35%] text-left' },
    { name: 'Score', allowsSorting: true, className: 'w-[20%] text-left' },
    { name: 'Games', allowsSorting: true, className: 'w-[25%] text-left' },
    { name: 'Chombo', allowsSorting: true, className: 'w-[auto] text-right' },
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
        topContent={topContent}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.name} className={column.className}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={filteredData} emptyContent={!isFetching ? 'No Data' : ' '}>
          {(item: any) => (
            <TableRow key={item.playerId}>
              <TableCell className="truncate whitespace-nowrap text-sm">
                {item.isWinner ? (
                  <span className="flex items-center gap-x-1">
                    <Icon icon="twemoji:trophy" className="w-5 h-5" /> {item.playerName}
                  </span>
                ) : (
                  `[${item.rank}]${item.playerName}`
                )}
              </TableCell>
              <TableCell className="text-sm text-left">
                {item.reducedTotalScore.toFixed(1)}
              </TableCell>
              <TableCell className="text-left">
                <div className="flex flex-col gap-0">
                  <span className="text-sm leading-none">{item.totalGames}</span>
                  <span className="text-xs text-default-400 leading-none mt-1">
                    {Object.values(item.rankingCount).slice(0, props.ruleset?.numPlayers).join('|')}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">{item.totalChombo}</TableCell>
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
