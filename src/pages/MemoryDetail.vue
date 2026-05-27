<template>
  <div class="memory-detail-page min-h-dvh px-4 pb-24 pt-8 relative z-10">
    <header class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-sakura-white/80 shadow-sm active:scale-95 transition-transform">
        <ChevronLeft :size="20" stroke="#3D1F2A" />
      </button>
      <h1 class="text-xl font-semibold text-text-primary">回忆详情</h1>
    </header>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="wish" class="space-y-4">
      <div class="memory-card p-5">
        <div class="text-center mb-4">
          <span class="text-4xl">{{ categoryIcon }}</span>
        </div>

        <h2 class="text-lg font-semibold text-text-primary text-center mb-2">{{ wish.title }}</h2>

        <div class="flex justify-center gap-2 mb-4">
          <span class="text-xs px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/30">已完成</span>
        </div>

        <p v-if="wish.description" class="text-sm text-text-secondary leading-relaxed mb-4 text-center">{{ wish.description }}</p>

        <div class="space-y-3 text-sm text-text-secondary">
          <p>完成于：{{ formatDate(wish.done_at) }}</p>
          <p v-if="wish.desired_at">期望时间：{{ wish.desired_at }}</p>
        </div>

        <div class="mt-4 pt-4 border-t border-accent-pink/20">
          <div class="flex items-center gap-1 mb-1">
            <span class="text-xs text-text-secondary">心情值：</span>
            <Heart v-for="i in 5" :key="i" :size="14" :fill="i <= wish.urgency ? '#E87FA5' : 'none'" stroke="#E87FA5" />
          </div>
        </div>

        <div v-if="wish.note" class="mt-4 pt-4 border-t border-accent-pink/20">
          <p class="text-xs text-text-secondary mb-1">悄悄话：</p>
          <p class="text-sm text-theme italic">"{{ wish.note }}"</p>
        </div>

        <div v-if="wish.reply_msg" class="mt-4 pt-4 border-t border-accent-pink/20">
          <p class="text-xs text-text-secondary mb-1">接单回复：</p>
          <p class="text-sm text-text-primary">"{{ wish.reply_msg }}"</p>
        </div>

        <div v-if="wish.done_msg" class="mt-4 pt-4 border-t border-gold/30">
          <p class="text-xs text-text-secondary mb-1">完成感言：</p>
          <p class="text-sm text-gold italic">"{{ wish.done_msg }}"</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16 text-text-secondary">
      <p class="text-4xl mb-3">📖</p>
      <p class="text-sm">未找到该回忆</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, Heart } from 'lucide-vue-next'
import { useWishesStore } from '@/store/wishes'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const wishesStore = useWishesStore()
const loading = ref(true)

const wish = computed(() => wishesStore.wishes.find(w => w.id === route.params.id))

const categoryMap = { eat: '🍜', play: '🎮', do: '🌸' }
const categoryIcon = computed(() => wish.value ? categoryMap[wish.value.category] : '🌸')

onMounted(async () => {
  await wishesStore.fetchWishes()
  loading.value = false
})

function formatDate(dateStr) {
  return dayjs(dateStr).format('YYYY年MM月DD日')
}
</script>

<style scoped>
.memory-card {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
}
</style>
