<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchClips } from '../services/clipsService.js'
import '../assets/css/ClipsSection.css'

const clips = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const sortedClips = computed(() =>
  [...clips.value]
    .sort(
      (a, b) =>
        new Date(b.published_at).getTime() -
        new Date(a.published_at).getTime()
    )
    .slice(0, 8)
)

onMounted(async () => {
  try {
    clips.value = await fetchClips()
  } catch (error) {
    errorMessage.value = 'Unable to load clips.'
    console.error('Failed to load clips:', error)
  } finally {
    isLoading.value = false
  }
})

function formatDate(date) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'UNKNOWN DATE'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}
</script>

<template>
  <section id="clips" class="clips-section">
    <header class="clips-heading">
      <p class="clips-eyebrow">
        <span>03 /</span> COMMUNITY
      </p>

      <h1 class="clips-title">
        RECENT <span>CLIPS.</span>
      </h1>

      <p class="clips-description">
        The plays worth watching.
      </p>
    </header>

    <div v-if="isLoading" class="clips-empty">
      <p class="clips-empty-title">LOADING CLIPS...</p>
    </div>

    <div v-else-if="errorMessage" class="clips-empty">
      <p class="clips-empty-title clips-error">
        {{ errorMessage }}
      </p>
    </div>

    <div v-else-if="sortedClips.length === 0" class="clips-empty">
      <span class="clips-empty-icon">◇</span>

      <p class="clips-empty-title">NO CLIPS AVAILABLE YET</p>

      <p class="clips-empty-description">
        Approved community clips will appear here.
      </p>
    </div>

    <div v-else class="clips-grid">
      <article
        v-for="clip in sortedClips"
        :key="clip.id"
        class="clip-card"
      >
        <div class="clip-player">
          <video
            controls
            playsinline
            preload="metadata"
            :src="clip.video_url"
          >
            Your browser does not support video playback.
          </video>
        </div>

        <div class="clip-info">
          <div class="clip-author">
            <span class="clip-status-dot"></span>
            <span>{{ clip.author || 'UNKNOWN PLAYER' }}</span>
          </div>

          <div class="clip-meta">
            <time :datetime="clip.published_at">
              {{ formatDate(clip.published_at) }}
            </time>

            <span class="clip-votes">
              <span aria-hidden="true">▲</span>
              {{ clip.votes ?? 0 }}
            </span>
          </div>

          <a
            v-if="clip.discord_url"
            class="clip-source"
            :href="clip.discord_url"
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW ON DISCORD
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </div>

    <p class="clips-footnote">
      COMMUNITY CLIPS APPROVED BY DEATHWISH ADMINS.
    </p>
  </section>
</template>