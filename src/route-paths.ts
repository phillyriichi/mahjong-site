export const baseUrl = import.meta.env.BASE_URL; 

export const SPA_ROUTES = {
  GALLERY: `${baseUrl}gallery`,
  EVENTS: `${baseUrl}events`,
  OLD_CITY: `${baseUrl}locations/old-city`,
  KOP: `${baseUrl}locations/kop`,
  CONTACT_US: `${baseUrl}contact-us`
}

export const PHILEAGUE_SPA_ROUTES = {
  GAME_LOGS: `${baseUrl}phileague/game-logs`,
  GAME_SHUFFLE: `${baseUrl}phileague/game-shuffle`,
  RANKINGS: `${baseUrl}phileague/rankings`,
  SCORE_ENTRY: `${baseUrl}phileague/score-entry`,
}
