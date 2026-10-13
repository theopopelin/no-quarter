<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchPlayers } from '../services/playersService'
import '../assets/css/MostWantedSection.css'

const players = ref([])
const loading = ref(true)
const error = ref(false)

const records = computed(() => {
  if (players.value.length === 0) {
    return []
  }

  const categories = [
    {
      id: 'soul-reaper',
      title: '"THE COLLECTOR"',
      subtitle: 'MOST SOULS IN ONE GAME',
      value: (player) => player.personal_record?.procs ?? 0,
      format: (value) => `${value} SOULS`,
    },
    {
      id: 'harvest-machine',
      title: '"HARVEST MACHINE"',
      subtitle: 'TOTAL SOULS COLLECTED',
      value: (player) => player.total_dark_harvest_procs ?? 0,
      format: (value) => `${value} SOULS`,
    },
    {
      id: 'no-lifer',
      title: '"NO LIFER"',
      subtitle: 'GAMES WITH DARK HARVEST',
      value: (player) => player.games_with_dark_harvest ?? 0,
      format: (value) => `${value} GAMES`,
    },
  ]

  return categories.map((category) => {
    const sortedPlayers = [...players.value].sort(
      (a, b) => category.value(b) - category.value(a),
    )

    const player = sortedPlayers[0]

    return {
      ...category,
      username: player.username,
      score: category.value(player),
      formattedScore: category.format(category.value(player)),
      matchId:
        category.id === 'soul-reaper'
          ? player.personal_record?.match_id
          : null,
    }
  })
})

async function loadPlayers() {
  loading.value = true
  error.value = false

  try {
    players.value = await fetchPlayers()
  } catch (err) {
    console.error('Unable to load Most Wanted:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(loadPlayers)
</script>

<template>
  <section class="most-wanted">
    <div class="most-wanted-heading">
      <p class="most-wanted-eyebrow">
        <span>//</span> WANTED FOR EXCESSIVE SOUL HARVESTING
      </p>

      <h2 class="most-wanted-title">
        THE MOST <span>WANTED.</span>
      </h2>
    </div>

    <p v-if="loading" class="most-wanted-message">
      ACCESSING DATABASE...
    </p>

    <p v-else-if="error" class="most-wanted-message error">
      DATABASE CONNECTION FAILED.
    </p>

    <p v-else-if="records.length === 0" class="most-wanted-message">
      NO RECORDS FOUND.
    </p>

    <div v-else class="most-wanted-grid">
      <article
        v-for="record in records"
        :key="record.id"
        class="wanted-card wanted-red"
      >
        <div class="wanted-card-top">
          <span class="wanted-label">{{ record.title }}</span>
          <span class="wanted-id">{{ record.subtitle }}</span>
        </div>

        <div class="wanted-card-content">
          <h3 class="wanted-record-title">{{ record.username }}</h3>
        </div>

        <div class="wanted-card-bottom">
          <span class="wanted-score">{{ record.formattedScore }}</span>

          <a
            class="wanted-match"
            :href="`https://www.op.gg/summoners/euw/${encodeURIComponent(record.username.replace('#', '-'))}/matches`"
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW PLAYER ↗
          </a>
        </div>
      </article>
    </div>
  </section>
</template>
