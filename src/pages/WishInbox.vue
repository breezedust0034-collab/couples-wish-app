<template>
  <div class="wish-inbox-page min-h-dvh px-4 pb-24 pt-8 relative z-10">
    <header class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-sakura-white/80 shadow-sm active:scale-95 transition-transform">
        <ChevronLeft :size="20" stroke="#3D1F2A" />
      </button>
      <h1 class="text-xl font-semibold text-text-primary">TA的心愿</h1>
    </header>

    <div class="filter-bar flex gap-2 mb-4 overflow-x-auto pb-1">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="activeFilter = filter.value"
        class="px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all"
        :class="activeFilter === filter.value ? 'bg-theme text-white' : 'bg-sakura-white text-text-secondary border border-accent-pink/20'"
      >
        {{ filter.label }}
      </button>
    </div>

    <LoadingSpinner v-if="wishesStore.loading" />

    <div v-else class="space-y-3">
      <WishCard
        v-for="wish in filteredWishes"
        :key="wish.id"
        :wish="wish"
        @click="goDetail"
      />
      <div v-if="filteredWishes.length === 0" class="text-center py-16 text-text-secondary">
        <p class="text-4xl mb-3">🌸</p>
        <p class="text-sm">暂时还没有心愿哦</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import { useWishesStore } from '@/store/wishes'
import { useAuthStore } from '@/store/auth'
import WishCard from '@/components/WishCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const wishesStore = useWishesStore()
const auth = useAuthStore()
const activeFilter = ref('all')

const filters = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待接单' },
  { value: 'confirmed', label: '已接单' },
  { value: 'rejected', label: '婉拒' },
  { value: 'done', label: '已完成' },
]

const otherIdentity = computed(() => auth.identity === 'her' ? 'him' : 'her')

const filteredWishes = computed(() => {
  const all = wishesStore.wishes.filter(w => w.author === otherIdentity.value)
  if (activeFilter.value === 'all') return all
  return all.filter(w => w.status === activeFilter.value)
})

onMounted(() => {
  wishesStore.fetchWishes()
})

function goDetail(wish) {
  router.push({ name: 'wish-detail', params: { id: wish.id } })
}
</script>
