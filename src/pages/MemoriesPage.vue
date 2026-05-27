<template>
  <div class="memories-page min-h-dvh px-4 pb-24 pt-8 relative z-10">
    <header class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-sakura-white/80 shadow-sm active:scale-95 transition-transform">
        <ChevronLeft :size="20" stroke="#3D1F2A" />
      </button>
      <h1 class="text-xl font-semibold text-text-primary">回忆册 📖</h1>
    </header>

    <div class="stats-card mb-6 p-5 text-center">
      <div class="flex justify-around text-center mb-4">
        <div>
          <p class="text-3xl font-display text-theme-deep font-semibold">{{ stats.daysTogether }}</p>
          <p class="text-xs text-text-secondary">在一起天数</p>
        </div>
        <div class="w-px bg-accent-pink/30"></div>
        <div>
          <p class="text-3xl font-display text-gold font-semibold">{{ stats.totalDone }}</p>
          <p class="text-xs text-text-secondary">已完成心愿</p>
        </div>
      </div>
      <div class="flex justify-center gap-4 text-xs text-text-secondary">
        <span>🍜 吃了 {{ stats.eatCount }} 次</span>
        <span>🎮 玩了 {{ stats.playCount }} 次</span>
        <span>🌸 做了 {{ stats.doCount }} 次</span>
      </div>
    </div>

    <LoadingSpinner v-if="wishesStore.loading" />

    <div v-else>
      <div v-for="year in groupedMemories" :key="year.year" class="mb-6">
        <button @click="year.expanded = !year.expanded" class="flex items-center gap-2 mb-3 w-full text-left">
          <ChevronDown :size="16" class="transition-transform text-text-secondary" :class="{ 'rotate-180': year.expanded }" />
          <h3 class="text-base font-semibold text-text-primary">{{ year.year }}年</h3>
          <span class="text-xs text-text-secondary">（{{ year.wishes.length }} 个心愿）</span>
        </button>
        <transition name="card">
          <div v-if="year.expanded" class="space-y-3">
            <div
              v-for="wish in year.wishes"
              :key="wish.id"
              @click="goDetail(wish)"
              class="memory-card cursor-pointer"
            >
              <div class="flex items-start gap-3">
                <span class="text-xl">{{ categoryIcon(wish.category) }}</span>
                <div class="flex-1">
                  <h4 class="text-sm font-semibold text-text-primary mb-1">{{ wish.title }}</h4>
                  <p class="text-xs text-text-secondary">完成于 {{ formatDate(wish.done_at) }}</p>
                  <div v-if="wish.done_msg" class="text-xs text-gold mt-1 italic">"{{ wish.done_msg }}"</div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div v-if="memories.length === 0" class="text-center py-16 text-text-secondary">
        <p class="text-4xl mb-3">📖</p>
        <p class="text-sm">还没有完成的心愿哦</p>
        <p class="text-xs mt-1">一起努力去实现心愿吧</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronDown } from 'lucide-vue-next'
import { useWishesStore } from '@/store/wishes'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import dayjs from 'dayjs'

const router = useRouter()
const wishesStore = useWishesStore()
const stats = ref({ daysTogether: 0, totalDone: 0, eatCount: 0, playCount: 0, doCount: 0 })

const memories = computed(() => wishesStore.memories)

const groupedMemories = computed(() => {
  const groups = {}
  memories.value.forEach(wish => {
    const year = dayjs(wish.done_at).year()
    if (!groups[year]) {
      groups[year] = { year, wishes: [], expanded: year === dayjs().year() }
    }
    groups[year].wishes.push(wish)
  })
  return Object.values(groups).sort((a, b) => b.year - a.year)
})

onMounted(async () => {
  await Promise.all([
    wishesStore.fetchWishes(),
    loadStats(),
  ])
})

async function loadStats() {
  stats.value = await wishesStore.fetchStats()
}

function categoryIcon(cat) {
  return { eat: '🍜', play: '🎮', do: '🌸' }[cat] || '🌸'
}

function formatDate(dateStr) {
  return dayjs(dateStr).format('MM月DD日')
}

function goDetail(wish) {
  router.push({ name: 'memory-detail', params: { id: wish.id } })
}
</script>

<style scoped>
.stats-card {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
}

.memory-card {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
  padding: 16px;
  transition: all 0.2s ease;
}

.memory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(200, 100, 130, 0.12);
}

.memory-card:active {
  transform: scale(0.98);
}
</style>
