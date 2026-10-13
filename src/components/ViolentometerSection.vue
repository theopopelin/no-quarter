<script setup>
import { onMounted, ref } from 'vue'
import '../assets/css/ViolentometerSection.css'

const levels = [
  {
    number: '01',
    name: 'NOTHING MUCH',
    description: 'Watch out',
    range: '0–15',
    progress: 25,
    color: 'low',
  },
  {
    number: '02',
    name: 'SUSPICIOUS ACTIVITY',
    description: 'Leave the area',
    range: '15–30',
    progress: 50,
    color: 'medium',
  },
  {
    number: '03',
    name: 'CONFIRMED PUBLIC INCIDENT',
    description: 'Seek cover as far as you can',
    range: '30–45',
    progress: 75,
    color: 'high',
  },
  {
    number: '04',
    name: 'CRITICAL THREAT TO CIVILIZATION',
    description: 'Give up and enjoy your final moments',
    range: '45+',
    progress: 100,
    color: 'extreme',
  },
]

const gaugesAnimated = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    gaugesAnimated.value = true
  })
})
</script>

<template>
  <section class="violentometer" aria-labelledby="violentometer-title">
    <div class="violentometer-heading">
      <h2 id="violentometer-title" class="violentometer-title">
        THE <span>VIOLENTOMETER.</span>
      </h2>

      <p class="violentometer-eyebrow">
        <span>//</span> THREAT ASSESSMENT PROTOCOL
      </p>
    </div>

    <div class="violentometer-scale">
      <article
        v-for="level in levels"
        :key="level.number"
        class="violentometer-level"
        :class="`level-${level.color}`"
      >
        <div class="level-number">{{ level.number }}</div>

        <div class="level-content">
          <div class="level-heading">
            <h3>{{ level.name }}</h3>
          </div>

          <p class="level-description">
            {{ level.description }}
          </p>

          <div
            class="level-gauge"
            role="img"
            :aria-label="`${level.name}: ${level.progress}% sur l'échelle illustrative`"
          >
            <div
              class="level-gauge-fill"
              :class="{ 'is-animated': gaugesAnimated }"
              :style="{
                '--gauge-progress': `${level.progress}%`,
                '--gauge-delay': `${(Number(level.number) - 1) * 150}ms`,
              }"
            ></div>
          </div>
        </div>

        <div class="level-range">
          <span>{{ level.range }}</span>
          <span>PROCS</span>
        </div>
      </article>
    </div>

  </section>
</template>
