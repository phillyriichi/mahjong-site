export const baseUrl = import.meta.env.BASE_URL

export const SPA_ROUTES = {
  HOME: `${baseUrl}`,
  ADMIN: `${baseUrl}admin`,
  ADMIN_WITH_TAB: `${baseUrl}admin/:tab`,
  GALLERY: `${baseUrl}gallery`,
  EVENTS_CALENDAR: `${baseUrl}events/calendar`,
  EVENTS_PRO2024: `${baseUrl}events/pro2024`,
  EVENTS_PRO2025: `${baseUrl}events/pro2025`,
  OLD_CITY: `${baseUrl}locations/old-city`,
  KOP: `${baseUrl}locations/kop`,
  CONTACT_US: `${baseUrl}contact-us`,
  LEAGUE: `${baseUrl}league`,
  LEAGUE_WITH_TAB: `${baseUrl}league/:tab`,
  LEAGUE_QUEUE: `${baseUrl}league/queue`,
  LEAGUE_SCORE_ENTRY: `${baseUrl}league/score-entry`,
  LEAGUE_RANKING: `${baseUrl}league/ranking`,
  LEAGUE_GAME_LOGS: `${baseUrl}league/game-logs`
}
