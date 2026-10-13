<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchPlayers } from '../services/playersService.js'
import '../assets/css/RankingSection.css'

const players = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const sortOptions = [
  { value: 'total', label: 'TOTAL SOULS' },
  { value: 'record', label: 'BEST RECORD' },
  { value: 'average', label: 'AVERAGE/GAME' },
]

const sortBy = ref('total')
const searchQuery = ref('')

onMounted(async () => {
  try {
    const data = await fetchPlayers()

    players.value = data.map((player, index) => {
      const games = Number(player.games_with_dark_harvest ?? 0)
      const total = Number(player.total_dark_harvest_procs ?? 0)

      return {
        id: player.username ?? index,
        name: player.username ?? 'Unknown player',
        total,
        record: Number(player.personal_record?.procs ?? 0),
        average: games > 0 ? total / games : 0,
        games,
      }
    })
  } catch (error) {
    errorMessage.value = 'Unable to load player rankings.'
    console.error('Failed to load ranking players:', error)
  } finally {
    isLoading.value = false
  }
})

const sortedPlayers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return players.value
    .filter((player) => player.name.toLowerCase().includes(query))
    .sort((a, b) => b[sortBy.value] - a[sortBy.value])
})
</script>

<template>
  <section id="ranking" class="ranking-section">
    <header class="ranking-heading">
      <p class="ranking-eyebrow">
        <span>02 /</span> DEATHWISH
      </p>

      <h1 class="ranking-title">
        GLOBAL <span>RANKING.</span>
      </h1>

      <p class="ranking-description">
        Get mogged by real harvesting professionals.
      </p>
    </header>

    <div class="ranking-controls">
      <label class="ranking-search">
        <span class="sr-only">Search player</span>
        <span class="ranking-search-icon" aria-hidden="true">⌕</span>

        <input
          v-model="searchQuery"
          type="search"
          placeholder="SEARCH PLAYER..."
        />
      </label>

      <div class="ranking-sort" aria-label="Sort players by">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          type="button"
          class="ranking-sort-button"
          :class="{ active: sortBy === option.value }"
          :aria-pressed="sortBy === option.value"
          @click="sortBy = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="ranking-table">
      <div class="ranking-table-header">
        <span class="ranking-rank-column">RANK</span>
        <span class="ranking-player-column">PLAYER</span>
        <span class="ranking-score-column">
          {{ sortOptions.find((option) => option.value === sortBy)?.label }}
        </span>
      </div>

      <div v-if="isLoading" class="ranking-empty">
        <p class="ranking-empty-title">LOADING PLAYERS...</p>
      </div>

      <div v-else-if="errorMessage" class="ranking-empty">
        <p class="ranking-empty-title">{{ errorMessage }}</p>
      </div>

      <TransitionGroup
        v-else-if="sortedPlayers.length"
        name="ranking-row"
        tag="div"
        class="ranking-player-list"
      >
        <article
          v-for="(player, index) in sortedPlayers"
          :key="player.id"
          class="ranking-player"
          :style="{ '--row-index': index }"
        >
          <span
            class="ranking-position"
            :class="{ 'ranking-position-first': index === 0 }"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <div class="ranking-player-info">
            <span class="ranking-player-name">{{ player.name }}</span>
            <span class="ranking-player-region">
              {{ player.games }} TRACKED GAMES
            </span>
          </div>

          <span class="ranking-player-score">
            {{
              Number(player[sortBy]).toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })
            }}
          </span>
        </article>
      </TransitionGroup>

      <div v-else class="ranking-empty">
        <span class="ranking-empty-icon">◇</span>

        <p class="ranking-empty-title">
          {{ searchQuery ? 'NO PLAYER FOUND' : 'NO PLAYERS TRACKED YET' }}
        </p>

        <p class="ranking-empty-description">
          {{
            searchQuery
              ? 'Try another player name.'
              : 'Tracked players will appear here once data is available.'
          }}
        </p>
      </div>
    </div>

    <p class="ranking-footnote">
      RANKINGS ARE BASED ON TRACKED PLAYERS ONLY.
    </p>
  </section>
</template>