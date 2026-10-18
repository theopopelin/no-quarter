
<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'

import '../assets/css/CustomVideoPlayer.css'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'COMMUNITY CLIP',
  },
  expanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-expand'])

const video = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)

const progress = computed(() => {
  if (!duration.value) return 0

  return Math.min(
    100,
    Math.max(0, (currentTime.value / duration.value) * 100)
  )
})

const volumeProgress = computed(() =>
  isMuted.value ? 0 : volume.value * 100
)

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00'
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

async function togglePlayback() {
  if (!video.value) return

  if (video.value.paused) {
    try {
      await video.value.play()
    } catch (error) {
      console.error('Unable to play clip:', error)
    }
  } else {
    video.value.pause()
  }
}

function updateTime() {
  if (video.value) {
    currentTime.value = video.value.currentTime
  }
}

function updateDuration() {
  if (!video.value) return

  duration.value = Number.isFinite(video.value.duration)
    ? video.value.duration
    : 0
}

function seek(event) {
  if (!video.value || !duration.value) return

  video.value.currentTime =
    (Number(event.target.value) / 100) * duration.value

  currentTime.value = video.value.currentTime
}

function updateVolume(event) {
  if (!video.value) return

  const newVolume = Number(event.target.value)

  volume.value = newVolume
  video.value.volume = newVolume
  video.value.muted = newVolume === 0
  isMuted.value = newVolume === 0
}

function toggleMute() {
  if (!video.value) return

  if (video.value.muted || volume.value === 0) {
    const restoredVolume = volume.value === 0 ? 1 : volume.value

    volume.value = restoredVolume
    video.value.volume = restoredVolume
    video.value.muted = false
    isMuted.value = false
  } else {
    video.value.muted = true
    isMuted.value = true
  }
}

function toggleExpand() {
  emit('toggle-expand')
}

function handleKeydown(event) {
  if (event.key === 'Escape' && props.expanded) {
    toggleExpand()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <button
      v-if="expanded"
      class="video-modal-backdrop"
      type="button"
      aria-label="Close expanded video"
      @click="toggleExpand"
    ></button>

    <div
      class="custom-video-player"
      :class="{
        'is-playing': isPlaying,
        'is-paused': !isPlaying,
        'is-expanded': expanded,
      }"
    >
      <video
        ref="video"
        class="custom-video"
        :src="src"
        preload="metadata"
        playsinline
        @timeupdate="updateTime"
        @loadedmetadata="updateDuration"
        @durationchange="updateDuration"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="isPlaying = false"
        @click="togglePlayback"
      >
        Your browser does not support video playback.
      </video>

      <div class="video-top-label">
        <span class="video-live-dot"></span>
        <span>{{ label || 'COMMUNITY CLIP' }}</span>
      </div>

      <button
        class="video-center-button"
        type="button"
        :aria-label="isPlaying ? 'Pause video' : 'Play video'"
        @click="togglePlayback"
      >
        <span aria-hidden="true">
          {{ isPlaying ? '❚❚' : '▶' }}
        </span>
      </button>

      <div class="video-controls">
        <input
          class="video-progress"
          type="range"
          min="0"
          max="100"
          step="0.1"
          :value="progress"
          :style="{ '--video-progress': `${progress}%` }"
          :aria-label="`Video progress: ${Math.round(progress)}%`"
          :aria-valuetext="`${formatTime(currentTime)} / ${formatTime(duration)}`"
          @input="seek"
        />

        <div class="video-controls-bottom">
          <button
            class="video-control-button video-play-button"
            type="button"
            :aria-label="isPlaying ? 'Pause video' : 'Play video'"
            @click="togglePlayback"
          >
            <span aria-hidden="true">
              {{ isPlaying ? '❚❚' : '▶' }}
            </span>
          </button>

          <span class="video-time">
            <span class="video-current-time">
              {{ formatTime(currentTime) }}
            </span>
            <span class="video-time-separator">/</span>
            {{ formatTime(duration) }}
          </span>

          <div class="video-volume">
            <button
              class="video-control-button video-volume-button"
              type="button"
              :aria-label="isMuted ? 'Unmute video' : 'Mute video'"
              :aria-pressed="isMuted"
              @click="toggleMute"
            >
              <span aria-hidden="true">
                {{ isMuted || volume === 0 ? '×' : '♪' }}
              </span>
            </button>

            <input
              class="video-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              :value="isMuted ? 0 : volume"
              :style="{ '--volume-level': `${volumeProgress}%` }"
              aria-label="Video volume"
              :aria-valuetext="`${Math.round(volumeProgress)}%`"
              @input="updateVolume"
            />
          </div>

          <span class="video-controls-spacer"></span>

          <button
            class="video-control-button video-expand-button"
            type="button"
            :aria-label="expanded ? 'Close expanded video' : 'Enlarge video'"
            :aria-expanded="expanded"
            @click="toggleExpand"
          >
            <span aria-hidden="true">
              {{ expanded ? '⤡' : '⤢' }}
            </span>
          </button>
        </div>
      </div>
    </div>
</template>
