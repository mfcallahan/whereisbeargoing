<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Animation starts only after the full page (including the image) has loaded.
const animating = ref(false)
const start = () => { animating.value = true }

onMounted(() => {
  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })
})
onBeforeUnmount(() => window.removeEventListener('load', start))
</script>

<template>
  <div class="wrap">
    <div class="frame">
      <img
        :class="{ zoom: animating }"
        src="../img/bear1.webp"
        alt="Bear, a Golden Retriever, pooping in a sunlit pine forest clearing"
      />
    </div>
  </div>
</template>

<style scoped>
.wrap {
  padding: 1rem;
}

.frame {
  margin: 0 auto;
  overflow: hidden;
  width: 100%;
  max-width: calc((100vh - 2rem) * 4 / 3);
  max-width: calc((100dvh - 2rem) * 4 / 3);
}

img {
  display: block;
  width: 100%;
  height: auto;
  will-change: transform;
}

/*
  Cycle = 5s, repeating forever:
    0    – 1.5s  full image (hold)
    1.5  – 3.5s  zoom in to the dog (2s)
    3.5  – 5.0s  hold on the dog (1.5s)
    then a hard cut back to the full image as the loop restarts.

  Dog center ≈ 75.6% x, 65.8% y of the photo. With scale S and the
  default center origin, translate = -S * (point - 50%) centers it.
*/
img.zoom {
  animation: dog-zoom 5s infinite;
}

@keyframes dog-zoom {
  0%, 30% {
    transform: translate(0, 0) scale(1);
    animation-timing-function: ease-in-out;
  }
  70%, 100% {
    transform: translate(-76.8%, -47.4%) scale(3);
  }
}

@media (prefers-reduced-motion: reduce) {
  img.zoom { animation: none; }
}
</style>
