import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export interface GcpTimestamp {
  _seconds: number
  _nanoseconds: number
}

export const MembershipType = {
  TANYAO: 'TANYAO',
  MANGAN: 'MANGAN',
  NON_MEMBER: 'NON_MEMBER'
} as const

export type MembershipType = (typeof MembershipType)[keyof typeof MembershipType]

export interface MembershipStatus {
  type: string
  expire: GcpTimestamp
}

export interface PlayerObject {
  id: number
  name: string
  signedIn?: boolean
  membership?: MembershipStatus[]
  email?: string
  [propName: string]: unknown
}

export interface RulesetObject {
  id: string
  name: string
  numPlayers: number
  startingPoints: number
  seasons?: { [key: string]: SeasonObject }
  selectText?: string | null
  [propName: string]: unknown
}

export interface SeasonObject {
  id: string
  name: string
  startDate: GcpTimestamp
  endDate: GcpTimestamp
  totalScoreReducer?: string
  winner?: number
  selectText?: string | null
  [propName: string]: unknown
}

export interface ScoreData {
  score: number
  chombo: number
}

export interface PlayerScoreRecord {
  player: PlayerObject | null
  scoreData: ScoreData
}

export const DEFAULT_SCORE_DATA: ScoreData = {
  score: 0,
  chombo: 0
}

export interface GameResultData {
  ruleset: RulesetObject
  players: { [key: number]: ScoreData }
}

export interface GameLogPlayerData {
  id: number
  name: string
  score: number
  totalScore: number
  ranking: number
  chombo: number
}

export interface GameLog {
  id: string
  players: GameLogPlayerData[]
  timestamp: GcpTimestamp
}

export const DEFAULT_GAME_LOG: GameLog = {
  id: '',
  players: [],
  timestamp: { _seconds: 0, _nanoseconds: 0 }
}

export interface AggregatedRankingData {
  playerId: number
  playerName: string
  rankingCount: Map<number, number>
  reducedTotalScore: number
  totalChombo: number
  totalGames: number
}

export interface PlayerOpponentStatsData {
  [key: number]: {
    numGames: number
    pointsExchangeEstimation: number
  }
}

export interface PlayerPointsHistogramData {
  buckets: number[]
  counts: number[]
  interval: number
  totalCount: number
}

export interface PlayerProfileData {
  timestamp: GcpTimestamp
  METADATA: {
    count: number

    maxAvgFirstPlaceScore: number
    minAvgFirstPlaceScore: number

    maxFirstPlaceGamesRate: number
    minFirstPlaceGamesRate: number

    maxHigherThanStartingPointsRate: number
    minHigherThanStartingPointsRate: number

    maxNegativePointsRate: number
    minNegativePointsRate: number

    maxRValue: number
    minRValue: number

    maxTopThreeRate: number
    minTopThreeRate: number

    maxTopTwoRate: number
    minTopTwoRate: number
  }
  firstPlaceAvgScore: number
  firstPlaceInRecentTenGames: number
  gamesCount: number
  higherThanStartingPointsRate: number
  negativeRate: number
  rValue: number
  topRate: {
    [key: string]: number
  }
}

export interface AggregatedPlayerStatsData {
  allPoints: number[]
  gamesCount: number
  highestPoints: number
  lowestPoints: number
  opponentsStats: PlayerOpponentStatsData
  pointsHistogram: PlayerPointsHistogramData
  profile?: PlayerProfileData
  rankingMap: {
    [key: string]: number
  }
  recentPointsRank: {
    ranking: number
    points: number
  }[]
  totalScoreSum: number
}

// Full history season
export const FULL_HISTORY: SeasonObject = {
  id: '-1',
  name: 'Full History',
  selectText: 'Full History',
  startDate: { _seconds: 0, _nanoseconds: 0 }, // 1/1/1970
  endDate: { _seconds: 16725225600, _nanoseconds: 0 } // 1/1/2500
}

export const DEFAULT_RULESET_ID = 'PHI_LEAGUE'

export const BACKEND_URL: string =
  'https://us-central1-phillymahjong-4e287.cloudfunctions.net/phillyMahjawnBackendRequestHandler'

export const PLACEMENT_TEXT: { [key: string]: string } = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th'
}

export const MEMBERSHIP_TYPES_TEXT: { [key: string]: string } = {
  TANYAO: 'Tanyao',
  MANGAN: 'Mangan',
  NON_MEMBER: 'NonMember'
}

export function convertGcpTimestampToDate(timestamp: GcpTimestamp | null): Date | null {
  if (!timestamp) {
    return timestamp
  }
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
}

export function loadAllPlayers(): PlayerObject[] {
  const { isPending, error, data } = useQuery({
    queryKey: ['loadAllPlayersResult'],
    queryFn: () =>
      axios.post(BACKEND_URL, { action: 'load_players' }).then((res) => res.data.players)
  })

  if (isPending) {
    return []
  }
  if (error) {
    console.error('Error loading players:', error.message)
    return []
  }
  return data.map((p: any) => {
    return {
      id: p.id,
      name: p.name
    }
  })
}

/**
 * Fetches players data from backend.
 *
 * @returns fetched player data.
 */
export async function fetchPlayers(): Promise<PlayerObject[]> {
  const dataToPost = { action: 'load_players' }
  const response = await axios.post(BACKEND_URL, dataToPost)
  return response.data.players
}

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
    staleTime: 5000 //5s
  })
}

/**
 * Fetches rulesets data from backend.
 *
 * @returns Fetched rulesets data
 */
export async function fetchRulesets(): Promise<RulesetObject[]> {
  const dataToPost = { action: 'load_rulesets' }
  const response = await axios.post(BACKEND_URL, dataToPost)
  return Object.values(response.data)
}

export const useRulesets = () => {
  return useQuery({ queryKey: ['rulesets'], queryFn: fetchRulesets })
}

/**
 * Fetches ranking data for specified ruleset and season.
 *
 * @param rulesetId The ruleset ID.
 * @param season The season object.
 * @returns fecthed ranking data.
 */
export async function fecthRanking(
  rulesetId: string,
  season: SeasonObject
): Promise<AggregatedRankingData[]> {
  const dataToPost = {
    action: 'get_rankings',
    ruleset: rulesetId,
    startDate: convertGcpTimestampToDate(season?.startDate),
    endDate: convertGcpTimestampToDate(season?.endDate),
    seasonId: season?.id
  }
  const response = await axios.post(BACKEND_URL, dataToPost)
  return response.data
}

export const useRanking = (
  ruleset: RulesetObject | null | undefined,
  season: SeasonObject | null | undefined,
  options: { [key: string]: any } = {}
) => {
  return useQuery({
    queryKey: ['ranking', ruleset?.id, season?.id],
    queryFn: async () => {
      return fecthRanking(ruleset!.id, season!)
    },
    enabled: !!ruleset && !!season,
    staleTime: 10000, //10s
    placeholderData: (previousData) => previousData,
    ...options
  })
}

/**
 * Fetches player stats data.
 *
 * @param rulesetId The ruleset ID.
 * @param season The season object.
 * @param playerId The playerId.
 * @returns fecthed player stats data.
 */
export async function fetchPlayerStats(
  ruleset: RulesetObject,
  season: SeasonObject,
  playerId: number,
  playerName: string
): Promise<AggregatedPlayerStatsData> {
  const dataToPost = {
    action: 'get_player_stats',
    ruleset: ruleset.id,
    playerId: playerId,
    playerName: playerName,
    startDate: convertGcpTimestampToDate(season?.startDate),
    endDate: convertGcpTimestampToDate(season?.endDate)
  }
  const response = await axios.post(BACKEND_URL, dataToPost)
  return response.data
}

export const usePlayerStats = (
  ruleset: RulesetObject | null | undefined,
  season: SeasonObject | null | undefined,
  playerId: number | null | undefined,
  playerName: string | null | undefined,
  options: { [key: string]: any } = {}
) => {
  return useQuery({
    queryKey: ['playerStats', ruleset?.id, season?.id, playerId],
    queryFn: async () => {
      return fetchPlayerStats(ruleset!, season!, playerId!, playerName!)
    },
    enabled: !!ruleset?.id && !!season && !!playerId && !!playerName,
    staleTime: 30000, //30s
    placeholderData: (previousData) => previousData,
    ...options
  })
}

/**
 * Fetches game logs data for specified ruleset, season, and optionally player.
 *
 * @param rulesetId The ruleset ID.
 * @param season The season object.
 * @param player The player .
 * @returns fecthed ranking data.
 */
export async function fetchGameLogs(
  rulesetId: string,
  season: SeasonObject,
  player: PlayerObject | null | undefined
) {
  const dataToPost = {
    action: 'get_game_logs',
    ruleset: rulesetId,
    startDate: convertGcpTimestampToDate(season.startDate),
    endDate: convertGcpTimestampToDate(season.endDate),
    playerId: player?.id,
    playerName: player?.name
  }
  const response = await axios.post(BACKEND_URL, dataToPost)
  return response.data
}

export const useGameLogs = (
  ruleset: RulesetObject | null | undefined,
  season: SeasonObject | null | undefined,
  player: PlayerObject | null | undefined,
  options: { [key: string]: any } = {}
) => {
  return useQuery({
    queryKey: ['gameLogs', ruleset?.id, season?.id, player?.id],
    queryFn: async () => {
      return fetchGameLogs(ruleset!.id, season!, player)
    },
    enabled: !!ruleset && !!season,
    staleTime: 10000, // 10s
    placeholderData: (previousData) => previousData,
    ...options
  })
}

export async function submitGameResults(ruleset: RulesetObject, records: PlayerScoreRecord[]) {
  const playersData: { [key: number]: ScoreData } = {}
  records.forEach((record) => {
    playersData[record.player!.id] = record.scoreData
  })
  const dataToPost = {
    action: 'add_game',
    ruleset: ruleset.id,
    game: {
      players: playersData
    }
  }
  await axios.post(BACKEND_URL, dataToPost)
}

export async function deleteGameLog(rulesetId: string, gameId: string) {
  const dataToPost = {
    action: 'delete_game',
    ruleset: rulesetId,
    game_id: gameId
  }
  await axios.post(BACKEND_URL, dataToPost)
}

/**
 * Resolve a player's membership status at a given timestamp
 *
 * @param player Player to resolve membership
 * @param timestamp given timestamp, if null, use the current time.
 */
export function resolveMembership(
  player: PlayerObject | null,
  timestamp: Date | null = null
): { type: MembershipType; expire: Date | null } {
  if (!player || !player.membership || player.membership.length == 0) {
    return {
      type: MembershipType.NON_MEMBER,
      expire: null
    }
  }
  const targetTime = timestamp ?? new Date()
  for (const membership of player.membership) {
    if (convertGcpTimestampToDate(membership.expire)!.getTime() >= targetTime.getTime()) {
      return {
        type: membership.type as MembershipType,
        expire: convertGcpTimestampToDate(membership.expire)
      }
    }
  }
  return {
    type: MembershipType.NON_MEMBER,
    expire: null
  }
}
