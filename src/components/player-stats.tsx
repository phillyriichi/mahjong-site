import { Spinner } from '@heroui/spinner'
import {
  PLACEMENT_TEXT,
  usePlayers,
  usePlayerStats,
  type AggregatedPlayerStatsData,
  type PlayerObject,
  type PlayersMap,
  type RulesetObject,
  type SeasonObject
} from './backend-manager'
import ReactECharts from 'echarts-for-react'
import { graphic } from 'echarts'
import { Alert } from '@heroui/alert'
import { useEffect, useMemo, useState } from 'react'
import PlayerSelect from './player-select'
import RulesetSelect from './ruleset-select'
import SeasonSelect from './season-select'

type PlayerStatsProps = {
  ruleset: RulesetObject | null | undefined
  season: SeasonObject | null
  playerId: number | null | undefined
}

function getProfileChartOption(stats: AggregatedPlayerStatsData | null | undefined) {
  if (!stats || !stats.profile) {
    return {}
  }
  const profile = stats.profile
  const moreGamesNeeded = profile.gamesCount < 20
  const data = {
    // Set min and max in a way that prevents lower than min, but allows exceeding max to some extend.
    FirePower: {
      value: Math.max(profile.firstPlaceAvgScore, profile.METADATA.minAvgFirstPlaceScore * 0.96),
      min: profile.METADATA.minAvgFirstPlaceScore * 0.96,
      max: profile.METADATA.maxAvgFirstPlaceScore * 0.96,
      description: '1st place average scores'
    },
    Defense: {
      value: Math.max(-profile.negativeRate, -profile.METADATA.maxNegativePointsRate),
      max: -profile.METADATA.minNegativePointsRate,
      min: -profile.METADATA.maxNegativePointsRate,
      description: 'Negative score games ratio'
    },
    Stable: {
      value: Math.max(profile.topRate[2], profile.METADATA.minTopTwoRate),
      min: profile.METADATA.minTopTwoRate,
      max: profile.METADATA.maxTopTwoRate,
      description: '1st and 2nd places ratio'
    },
    Luck: {
      value: profile.firstPlaceInRecentTenGames,
      min: 0,
      max: 5,
      description: 'Recent 1st places ratio'
    },
    Skill: {
      value: Math.max(profile.rValue, profile.METADATA.minRValue * 0.96),
      min: profile.METADATA.minRValue * 0.96,
      max: profile.METADATA.maxRValue * 0.96,
      description: 'Rate Value'
    },
    Attack: {
      value: Math.max(profile.topRate[1], profile.METADATA.minFirstPlaceGamesRate),
      min: profile.METADATA.minFirstPlaceGamesRate,
      max: profile.METADATA.maxFirstPlaceGamesRate,
      description: '1st places ratio'
    }
  }
  const option = {
    title: {
      text: 'Profile' + (moreGamesNeeded ? ' - More Games Needed' : ''),
      left: 'left'
    },
    tooltip: {
      trigger: 'item',
      formatter:
        '<b>Full History Profile (Updated Daily) </b><br/>' +
        Object.entries(data)
          .map(([key, val]) => `<b>${key}:</b>${val.description}`)
          .join('<br/>')
    },
    radar: {
      indicator: Object.entries(data).map(([key, val]) => {
        return {
          name: `${key}`,
          min: val.min,
          max: val.max
        }
      })
    },
    series: [
      {
        name: 'Profile',
        type: 'radar',
        data: moreGamesNeeded
          ? []
          : [
              {
                value: Object.values(data).map((val) => val.value)
              }
            ],
        areaStyle: {
          color: new graphic.RadialGradient(0.1, 0.9, 1, [
            {
              color: 'rgba(46, 60, 214, 0.1)',
              offset: 0
            },
            {
              color: 'rgba(250, 53, 247, 0.6)',
              offset: 1
            }
          ])
        }
      }
    ]
  }
  return option
}

function getRecentGamesOption(
  stats: AggregatedPlayerStatsData | null | undefined,
  ruleset: RulesetObject | null | undefined
) {
  if (!stats || !stats.recentPointsRank || !ruleset) {
    return {}
  }
  const data = stats.recentPointsRank.map((x) => x.ranking)

  const option = {
    title: {
      text: `Recent Games (Count: ${data.length})`,
      left: 'left'
    },
    xAxis: {
      type: 'category',
      show: false
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: ruleset.numPlayers,
      interval: 1,
      inverse: true,
      axisLabel: {
        show: true,
        formatter: (x: any) => PLACEMENT_TEXT[x]
      }
    },
    grid: {
      top: '25%',
      bottom: '15%'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (item: any) {
        return `${PLACEMENT_TEXT[item[0].data]}: ${stats.recentPointsRank[item[0].dataIndex].points}`
      }
    },
    series: [
      {
        data: data,
        type: 'line',
        lineStyle: {
          color: '#5b5b5b'
        },
        itemStyle: {
          color: function (params: any) {
            if (params.data == 1) {
              return '#3d85c6'
            } else if (params.data == 2) {
              return '#6aa84f'
            } else if (params.data == 3) {
              return '#f6b26b'
            } else if (params.data == 4) {
              return '#e06666'
            }
          }
        }
      }
    ]
  }
  return option
}

function getRankingChartOption(stats: AggregatedPlayerStatsData | null | undefined) {
  if (!stats || !stats.rankingMap) {
    return {}
  }

  const data = Object.keys(stats.rankingMap)
    .toSorted()
    .map((r) => {
      return {
        name: PLACEMENT_TEXT[r],
        value: stats.rankingMap[r]
      }
    })
  const option = {
    title: {
      text: `Placement Distribution (Total: ${stats.gamesCount})`,
      left: 'left'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br>{c} Games ({d}%)'
    },
    series: [
      {
        name: 'Placement',
        type: 'pie',
        radius: '60%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  return option
}

function getPointsDistributionOption(
  stats: AggregatedPlayerStatsData | null | undefined,
  ruleset: RulesetObject | null | undefined
) {
  if (!stats || !stats.pointsHistogram || !ruleset) {
    return {}
  }
  const histogram = stats.pointsHistogram
  const interval = histogram.interval
  const totalCount = histogram.totalCount
  const option = {
    title: {
      text: `Points Distribution (Total: ${stats.gamesCount})`,
      left: `left`
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (item: any) {
        return `${item[0].axisValue / 1000}k-${(Number(item[0].axisValue) + interval) / 1000}k: ${item[0].data} (${((item[0].data / totalCount) * 100).toFixed(1)}%)`
      }
    },
    xAxis: [
      {
        data: histogram.buckets,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          formatter: (x: any) => `${x / 1000}k`
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'count',
        type: 'bar',
        barWidth: '60%',
        data: histogram.counts,
        itemStyle: {
          color: function (params: any) {
            const points = Number(params.name)
            const startingPoints = ruleset.startingPoints
            if (points >= startingPoints) {
              return '#0e8a06'
            } else {
              return '#e06666'
            }
          }
        }
      }
    ]
  }
  return option
}

function getFrequentOpponentsOption(
  stats: AggregatedPlayerStatsData | null | undefined,
  players: PlayersMap | null | undefined
) {
  if (!stats || !stats.opponentsStats || !players) {
    return {}
  }

  const sortedOpponents = Object.entries(stats.opponentsStats)
    .map(([oppoId, oppoData]) =>
      Object({
        id: oppoId,
        ...oppoData
      })
    )
    .toSorted((a, b) => {
      return a.numGames < b.numGames ? 1 : -1
    })

  const data = sortedOpponents.slice(0, Math.min(9, sortedOpponents.length)).map((p) => {
    return {
      name: players[Number(p.id)]?.name,
      value: p.numGames
    }
  })
  const option = {
    title: {
      text: `Frequent Opponents`
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br>{c} Games'
    },
    series: [
      {
        name: 'Player',
        type: 'pie',
        radius: '60%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  return option
}

function getPointSourceOption(
  stats: AggregatedPlayerStatsData | null | undefined,
  players: PlayersMap | null | undefined
) {
  if (!stats || !stats.opponentsStats || !players) {
    return {}
  }
  // distribution of getting points from
  const sortedOpponents = Object.entries(stats.opponentsStats)
    .map(([oppoId, oppoData]) =>
      Object({
        id: oppoId,
        ...oppoData
      })
    )
    .filter((x) => x.pointsExchangeEstimation > 0)
    .toSorted((a, b) => {
      return a.pointsExchangeEstimation < b.pointsExchangeEstimation ? 1 : -1
    })
  const data = sortedOpponents.slice(0, Math.min(9, sortedOpponents.length)).map((p) =>
    Object({
      name: players[Number(p.id)]?.name,
      value: Math.floor(p.pointsExchangeEstimation)
    })
  )
  const option = {
    title: {
      text: `Mostly Gain Points From`
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br>Points: +{c}'
    },
    series: [
      {
        name: 'Player',
        type: 'pie',
        radius: '60%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  return option
}

function getPointDonationOption(
  stats: AggregatedPlayerStatsData | null | undefined,
  players: PlayersMap | null | undefined
) {
  if (!stats || !stats.opponentsStats || !players) {
    return {}
  }
  // distribution of losing points to
  const sortedOpponents = Object.entries(stats.opponentsStats)
    .map(([oppoId, oppoData]) => Object({ id: oppoId, ...oppoData }))
    .filter((x) => x.pointsExchangeEstimation < 0)
    .toSorted((a, b) => {
      return a.pointsExchangeEstimation > b.pointsExchangeEstimation ? 1 : -1
    })
  const data = sortedOpponents.slice(0, Math.min(9, sortedOpponents.length)).map((p) =>
    Object({
      name: players[Number(p.id)]?.name,
      value: Math.floor(-p.pointsExchangeEstimation)
    })
  )
  const option = {
    title: {
      text: `Mostly Donate Points To`
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br>Points: -{c}'
    },
    series: [
      {
        name: 'Player',
        type: 'pie',
        radius: '60%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  return option
}

const PlayerStats = (props: PlayerStatsProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerObject | null>(null)
  const [selectedRuleset, setSelectedRuleset] = useState<RulesetObject | null>(
    props.ruleset ?? null
  )
  const [selectedSeason, setSelectedSeason] = useState<SeasonObject | null>(props.season ?? null)
  const { data: players, isFetching: isFecthingPlayers } = usePlayers()

  useEffect(() => {
    if (players && props.playerId) {
      setSelectedPlayer(players[props.playerId] ?? null)
    }
  }, [players, props.playerId])

  const { data: stats, isFetching: isFetchingStats } = usePlayerStats(
    selectedRuleset,
    selectedSeason,
    selectedPlayer?.id,
    selectedPlayer?.name
  )

  const profileChartOption = useMemo(() => {
    return getProfileChartOption(stats)
  }, [stats])
  const recentGamesOption = useMemo(() => {
    return getRecentGamesOption(stats, selectedRuleset)
  }, [stats, selectedRuleset])
  const rankingChartOption = useMemo(() => {
    return getRankingChartOption(stats)
  }, [stats])
  const pointsDistributionOption = useMemo(() => {
    return getPointsDistributionOption(stats, selectedRuleset)
  }, [stats, selectedRuleset])
  const frequentOpponentsOption = useMemo(() => {
    return getFrequentOpponentsOption(stats, players)
  }, [stats, players])
  const pointSourceOption = useMemo(() => {
    return getPointSourceOption(stats, players)
  }, [stats, players])
  const pointDonationOption = useMemo(() => {
    return getPointDonationOption(stats, players)
  }, [stats, players])

  const header = () => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full items-end">
        <RulesetSelect
          className="w-full"
          selectedRuleset={selectedRuleset}
          onSelectionChange={setSelectedRuleset}
        />
        <SeasonSelect
          className="w-full"
          ruleset={selectedRuleset}
          selectedSeason={selectedSeason}
          onSelectionChange={setSelectedSeason}
          hasFullHistory={true}
        />
        <PlayerSelect
          className="w-full"
          selectedPlayer={selectedPlayer}
          onSelectionChange={setSelectedPlayer}
        />
      </div>
    )
  }

  if (isFecthingPlayers || isFetchingStats) {
    return (
      <>
        {header()}
        <Spinner color="primary" size="lg" label="Loading..." />
      </>
    )
  }

  if (!stats) {
    return (
      <>
        {header()}
        <Alert
          className="max-h-20"
          color="danger"
          title={`Failed to load stats for ${selectedPlayer?.name}`}
        />
      </>
    )
  }

  const mobileStyle = { height: 280, width: '90%' }

  return (
    <>
      {header()}
      <div className="flex flex-wrap">
        {selectedRuleset?.id == 'PHI_LEAGUE' ? (
          <ReactECharts option={profileChartOption} style={mobileStyle} />
        ) : (
          <></>
        )}
        {Object.keys(recentGamesOption).length > 0 ? (
          <ReactECharts option={recentGamesOption} style={mobileStyle} />
        ) : (
          <></>
        )}
        {Object.keys(rankingChartOption).length > 0 ? (
          <ReactECharts option={rankingChartOption} style={mobileStyle} />
        ) : (
          <></>
        )}
        {Object.keys(pointsDistributionOption).length > 0 ? (
          <ReactECharts option={pointsDistributionOption} style={mobileStyle} />
        ) : (
          <></>
        )}
        {Object.keys(frequentOpponentsOption).length > 0 ? (
          <ReactECharts option={frequentOpponentsOption} style={mobileStyle} />
        ) : (
          <></>
        )}
        {Object.keys(pointSourceOption).length > 0 ? (
          <ReactECharts option={pointSourceOption} style={mobileStyle} />
        ) : (
          <></>
        )}
        {Object.keys(pointDonationOption).length > 0 ? (
          <ReactECharts option={pointDonationOption} style={mobileStyle} />
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default PlayerStats
