<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { fetchPlayers } from '../services/playersService'
import '../assets/css/StatsSection.css'

const players = ref([])
const loading = ref(true)
const error = ref(false)

const stats = computed(() => {
  const totalSouls = players.value.reduce(
    (total, player) => total + (player.total_dark_harvest_procs ?? 0),
    0,
  )

  const totalGames = players.value.reduce(
    (total, player) => total + (player.games_with_dark_harvest ?? 0),
    0,
  )

  const averageHarvest = totalGames > 0 ? totalSouls / totalGames : 0

  return [
    {
      label: 'TOTAL SOULS COLLECTED',
      value: totalSouls,
    },
    {
      label: 'GAMES TRACKED',
      value: totalGames,
    },
    {
      label: 'AVERAGE HARVEST',
      value: averageHarvest,
      decimals: 2,
    },
  ]
})

const displayedValues = ref([0, 0, 0])
let animationFrame

function animateCounters() {
  cancelAnimationFrame(animationFrame)

  const duration = 2000
  const startTime = performance.now()
  const startValues = [...displayedValues.value]

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    const easedProgress = 1 - Math.pow(1 - progress, 9)

    displayedValues.value = stats.value.map((stat, index) => {
      const value =
        startValues[index] +
        (stat.value - startValues[index]) * easedProgress

      return Number(value.toFixed(stat.decimals ?? 0))
    })

    if (progress < 1) {
      animationFrame = requestAnimationFrame(update)
    }
  }

  animationFrame = requestAnimationFrame(update)
}

function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

async function loadPlayers() {
  loading.value = true
  error.value = false

  try {
    players.value = await fetchPlayers()
    animateCounters()
  } catch (err) {
    console.error('Unable to load statistics:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(loadPlayers)

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <section class="stats-section" aria-label="Global statistics">
    <article
      v-for="(stat, index) in stats"
      :key="stat.label"
      class="stat-card"
    >
      <div class="stat-label">
        <span>{{ stat.label }}</span>
        <span class="stat-index">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
      </div>

      <div class="stat-value">
        <template v-if="loading">
          ...
        </template>
        <template v-else-if="error">
          —
        </template>
        <template v-else>
          {{ formatNumber(displayedValues[index], stat.decimals ?? 0) }}
        </template>
      </div>
    </article>
  </section>
</template>