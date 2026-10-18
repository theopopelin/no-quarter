<script setup>
import '../assets/css/AppHeader.css'
import darkHarvestRune from '../assets/images/dh_rune.webp'

defineProps({
  currentPage: {
    type: String,
    default: 'home',
  },
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <header class="app-header">
    <nav class="header-nav" aria-label="Navigation principale">
      <a
        class="brand"
        href="/"
        aria-label="Deathwish - Accueil"
        :class="{ active: currentPage === 'home' }"
        @click.prevent="emit('navigate', 'home')"
      >
        <img
          class="brand-logo"
          :src="darkHarvestRune"
          alt="Dark Harvest"
        />
        <span class="brand-name">DEATHWISH</span>
      </a>

      <a
        class="header-nav-link"
        href="#ranking"
        :class="{ active: currentPage === 'ranking' }"
        :aria-current="currentPage === 'ranking' ? 'page' : undefined"
        @click.prevent="emit('navigate', 'ranking')"
      >
        RANKING
      </a>

      <a
        class="header-nav-link"
        href="#clips"
        :class="{ active: currentPage === 'clips' }"
        :aria-current="currentPage === 'clips' ? 'page' : undefined"
        @click.prevent="emit('navigate', 'clips')"
      >
        CLIPS
      </a>
    </nav>

    <a
      class="header-join"
      href="https://discord.com/invite/2VBemBFJPq"
      target="_blank"
      rel="noopener noreferrer"
    >
      APPLY HERE
      <span>↗</span>
    </a>
  </header>
</template>