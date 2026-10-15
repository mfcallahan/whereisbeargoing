<template>
  <div class="wrap">
    <img src="../img/bear1.webp" alt="Bear, a golden dog, sitting in a sunlit pine forest clearing" />
  </div>
</template>

<style scoped>
.wrap {
  padding: 1rem;
}

img {
  display: block;
  margin: 0 auto;
  width: 100%;
  height: auto;
  /* The photo is 4:3 (1600x1200). Capping the width at
     (available height x 4/3) keeps the rendered height within the viewport
     minus the 1rem margin above and below, with no distortion. dvh repeats
     the rule for browsers that support it, so mobile address-bar chrome
     doesn't push the bottom margin off screen. */
  max-width: calc((100vh - 2rem) * 4 / 3);
  max-width: calc((100dvh - 2rem) * 4 / 3);
}
</style>
