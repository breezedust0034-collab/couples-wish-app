<template>
  <div class="min-h-dvh bg-bg-main font-serif text-text-primary">
    <SakuraCanvas />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import SakuraCanvas from '@/components/SakuraCanvas.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Cormorant+Garamond:wght@400;500;600&family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&display=swap');

body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page-enter-active {
  transition: all 300ms ease-out;
}

.page-leave-active {
  transition: all 300ms ease-out;
  opacity: 0;
  transform: translateX(-20px);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.card-enter-active {
  transition: all 300ms ease-out;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
