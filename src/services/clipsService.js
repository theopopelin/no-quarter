const CLIPS_URL = 'https://pub-c09dd48630ba47d7b51837ed47512907.r2.dev/clips.json'

let clipsPromise = null

export function fetchClips() {
  if (!clipsPromise) {
    clipsPromise = fetch(CLIPS_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch clips')
        }

        return response.json()
      })
      .then((data) => Array.isArray(data.clips) ? data.clips : [])
      .catch((error) => {
        // Allow another attempt if fail
        clipsPromise = null
        throw error
      })
  }

  return clipsPromise
}