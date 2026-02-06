import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { addToast, type CalendarDate } from '@heroui/react'

export interface GcpTimestamp {
  _seconds: number
  _nanoseconds: number
}

function isGcpTimestamp(val: any): val is GcpTimestamp {
  return (
    val !== null &&
    typeof val === 'object' &&
    typeof val._seconds === 'number' &&
    typeof val._nanoseconds === 'number'
  )
}

export const MembershipType = {
  TANYAO: 'TANYAO',
  MANGAN: 'MANGAN',
  NON_MEMBER: 'NON_MEMBER'
} as const

export type MembershipType = (typeof MembershipType)[keyof typeof MembershipType]

export const MembershipTypeText = {
  [MembershipType.TANYAO]: 'Tanyao',
  [MembershipType.MANGAN]: 'Mangan',
  [MembershipType.NON_MEMBER]: 'NonMember'
} as const

export const AdminOpType = {
  SIGN_IN: 'SignIn',
  MEMBERSHIP: 'Membership',
  FIRST_TIME_VISIT: 'FirstTimeVisit'
} as const

export type AdminOpType = (typeof AdminOpType)[keyof typeof AdminOpType]

export const LocationType = {
  JAWNSOU: 'Jawnsou',
  KOP: 'KOP'
} as const

export type LocationType = (typeof LocationType)[keyof typeof LocationType]

export const PaymentType = {
  CASH: 'Cash',
  CARD: 'Card',
  VENMO: 'Venmo',
  VOUCHER: 'Voucher',
  WAIVED: 'Wavied'
} as const

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType]

export const QueueType = {
  LEAGUE: 'League',
  FLEXIBLE: 'Flexible',
  CASUAL: 'Casual'
} as const

export type QueueType = (typeof QueueType)[keyof typeof QueueType]

export const ActivityType = {
  SIGN_IN: 'SIGN_IN',
  MEMBERSHIP: 'MEMBERSHIP'
} as const

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType]

export const ActivityTypeText = {
  [ActivityType.SIGN_IN]: 'Sign-in',
  [ActivityType.MEMBERSHIP]: 'Membership'
}

export interface MembershipStatus {
  type: MembershipType
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

export type PlayersMap = { [key: number]: PlayerObject }

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

export interface ActivityLogData {
  id: string
  activity: string
  timestamp: Date
  playerId: number
  payment: {
    price?: number
    type: string
  }
  currentMembership?: MembershipType
  newMembership?: {
    tier: string
    type: MembershipType
    expire: GcpTimestamp
  }
  location?: LocationType
  [key: string]: any
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
export async function fetchPlayers(): Promise<PlayersMap> {
  const dataToPost = { action: 'load_players' }
  const response = await axios.post(BACKEND_URL, dataToPost)
  const playersMap: { [key: number]: PlayerObject } = {}
  if (response.data.players) {
    response.data.players.forEach((item: PlayerObject) => (playersMap[item.id] = { ...item }))
  }
  return playersMap
}

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
    staleTime: 1000 * 60 * 30 //30min
  })
}

export async function updatePlayer(id: number, name: string, email: string) {
  const dataToPost: { [key: string]: any } = {
    action: 'update_player',
    player_id: id,
    player_name: name,
    player_email: email
  }
  const response = await axios.post(BACKEND_URL, dataToPost)
  return response.data
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
  return useQuery({
    queryKey: ['rulesets'],
    queryFn: fetchRulesets,
    staleTime: 1000 * 60 * 60 * 24 /*1d*/
  })
}

/**
 * Fetches membership tier data from backend. This includes single visit.
 *
 * @returns Fetched membership tiers.
 */
export async function fetchMembershipTiers(): Promise<any> {
  const dataToPost = { action: 'load_membership_tiers' }
  const response = await axios.post(BACKEND_URL, dataToPost)
  return response.data
}

export const useMembershipTiers = () => {
  return useQuery({
    queryKey: ['membership_tiers'],
    queryFn: fetchMembershipTiers,
    staleTime: 1000 * 60 * 60 * 24 /*1d*/
  })
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
    staleTime: 1000 * 60 * 5, // 5min
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
    staleTime: 1000 * 60 * 5, // 5min
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
    staleTime: 1000 * 60 * 5, // 5min
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

/**
 * Fetches activity log data for a given date range.
 *
 * @returns fecthed ranking data.
 */
export async function fetchActivityLogs(
  startDateStr: string,
  endDateStr: string
): Promise<ActivityLogData[]> {
  const dataToPost = {
    action: 'load_activity_logs',
    start_date: startDateStr,
    end_date: endDateStr
  }
  const response = await axios.post(BACKEND_URL, dataToPost)
  return response.data.map((item: any) => {
    return {
      ...item,
      timestamp: convertGcpTimestampToDate(item.timestamp)
    }
  })
}

export const useActivityLogs = (
  start: CalendarDate | null,
  end: CalendarDate | null,
  options: { [key: string]: any } = {}
) => {
  return useQuery({
    queryKey: ['activityLogs', start, end],
    queryFn: async () => {
      return fetchActivityLogs(start!.toString(), end!.toString())
    },
    enabled: !!start && !!end,
    staleTime: 10000, //10s
    placeholderData: (previousData) => previousData,
    ...options
  })
}

export const formatDateTime = (val: Date | null): string => {
  if (!val) {
    return 'Invalid Date'
  }
  return (isGcpTimestamp(val) ? convertGcpTimestampToDate(val) : val)!.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/New_York'
  })
}

export const formatDate = (val: Date | GcpTimestamp | null, short: boolean = false): string => {
  if (!val) {
    return 'Invalid Date'
  }
  return (isGcpTimestamp(val) ? convertGcpTimestampToDate(val) : val)!.toLocaleDateString('en-US', {
    year: short ? '2-digit' : 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/New_York'
  })
}

export const formatTime = (val: Date | null): string => {
  if (!val) {
    return 'Invalid Time'
  }
  return (isGcpTimestamp(val) ? convertGcpTimestampToDate(val) : val)!.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/New_York'
  })
}

export const alertWithToast = (
  type: 'default' | 'foreground' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger',
  description: string,
  title?: string
) => {
  let toastTitle = ''
  if (title) {
    toastTitle = title
  } else if (type == 'danger') {
    toastTitle = 'Error'
  } else if (type == 'success') {
    toastTitle = 'Success'
  } else if (type == 'warning') {
    toastTitle = 'Warn'
  }
  addToast({
    title: toastTitle,
    description: description,
    color: type,
    variant: 'flat',
    classNames: {
      base: 'max-w-[400px] min-h-[120px]',
      title: 'text-lg font-bold',
      description: 'text-lg'
    }
  })
}

/**
 * Summarize a player's membership status and return a string
 */
export function summarizeMembershipStatus(membership: {
  type: MembershipType
  expire: Date | GcpTimestamp | null
}): string {
  if (!membership.expire) {
    return membership.type
  } else {
    return `${membership.type} (${formatDate(membership.expire)})`
  }
}

/**
 * resovle the price of a target date given a price schema.
 *
 */
export function resolvePriceFromSchema(
  priceSchema: { price: number; startTime: GcpTimestamp }[],
  timestamp?: Date
): number | null {
  const targetDate = timestamp ?? new Date()
  for (let i = 0; i < priceSchema.length; ++i) {
    // reach the last item
    if (i == priceSchema.length - 1) {
      // If the last item has start date later than target date, the target date price is unknown.
      if (convertGcpTimestampToDate(priceSchema[i].startTime)!.getTime() > targetDate.getTime()) {
        return null
      }
      return priceSchema[i].price
    }
    // not the last item
    if (
      convertGcpTimestampToDate(priceSchema[i].startTime)!.getTime() < targetDate.getTime() &&
      convertGcpTimestampToDate(priceSchema[i + 1].startTime)!.getTime() > targetDate.getTime()
    ) {
      return priceSchema[i].price
    }
  }
  return null
}

export async function signInPlayer(
  player: PlayerObject,
  currentMembership: MembershipType,
  paymentType: PaymentType,
  location: LocationType,
  price: number,
  queue: QueueType | null
) {
  const dataToPost = {
    action: 'signin_player',
    player_id: player.id,
    current_membership: currentMembership,
    payment_type: paymentType,
    location: location,
    price: price,
    queue: queue
  }
  return await axios.post(BACKEND_URL, dataToPost)
}

export async function revertActivityLog(id: string) {
  const dataToPost = {
    action: 'revert_activity_log',
    log_id: id
  }
  return await axios.post(BACKEND_URL, dataToPost)
}
