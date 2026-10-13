const PLAYERS_URL = 'https://pub-c09dd48630ba47d7b51837ed47512907.r2.dev/players.json'

let playersPromise = null

export function fetchPlayers() {
  if (!playersPromise) {
    playersPromise = fetch(PLAYERS_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch players')
        }

        return response.json()
      })
      .then((data) => Object.values(data.players ?? {}))
      .catch((error) => {
        // Allow another attempt if fail
        playersPromise = null
        throw error
      })
  }

  return playersPromise
}
