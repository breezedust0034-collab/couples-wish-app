<template>
  <div class="loading-spinner flex flex-col items-center justify-center gap-3 py-8">
    <div class="spinner relative w-12 h-12">
      <div class="petal absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-4 rounded-full bg-accent-pink opacity-80" style="transform-origin: center 24px;"></div>
      <div class="petal absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-4 rounded-full bg-theme opacity-70" style="transform-origin: center 24px; transform: translateX(-50%) rotate(72deg);"></div>
      <div class="petal absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-4 rounded-full bg-accent-pink opacity-60" style="transform-origin: center 24px; transform: translateX(-50%) rotate(144deg);"></div>
      <div class="petal absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-4 rounded-full bg-theme opacity-80" style="transform-origin: center 24px; transform: translateX(-50%) rotate(216deg);"></div>
      <div class="petal absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-4 rounded-full bg-accent-pink opacity-70" style="transform-origin: center 24px; transform: translateX(-50%) rotate(288deg);"></div>
    </div>
    <p class="text-text-secondary text-sm" v-if="text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: '心愿加载中...' }
})
</script>

<style scoped>
.spinner {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
