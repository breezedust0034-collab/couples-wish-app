<template>
  <div class="miss-received-page min-h-dvh px-4 pb-24 pt-8 relative z-10">
    <header class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-sakura-white/80 shadow-sm active:scale-95 transition-transform">
        <ChevronLeft :size="20" stroke="#3D1F2A" />
      </button>
      <h1 class="text-xl font-semibold text-text-primary">收到的想念 💌</h1>
    </header>

    <div v-if="records.length === 0" class="text-center py-16 text-text-secondary">
      <p class="text-4xl mb-3">💕</p>
      <p class="text-sm">还没有收到想念哦</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="record in records"
        :key="record.id"
        class="miss-card p-5"
      >
        <div class="flex items-center gap-3 mb-3">
          <span class="author-tag text-xs px-2 py-0.5 rounded-full bg-bg-secondary">{{ record.author === 'her' ? '她' : '他' }}</span>
          <span class="text-xs text-text-secondary">{{ formatDate(record.created_at) }}</span>
          <span class="miss-level-badge ml-auto text-xs px-2 py-0.5 rounded-full" :class="levelBadgeClass(record.level)">
            思念 {{ record.level }}/10
          </span>
        </div>
        <p v-if="record.message" class="text-sm text-text-primary leading-relaxed mb-3">{{ record.message }}</p>
        <img v-if="record.image" :src="record.image" class="miss-image rounded-lg max-h-48 object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import dayjs from 'dayjs'

const router = useRouter()
const auth = useAuthStore()
const records = ref([])

onMounted(() => {
  loadRecords()
})

function loadRecords() {
  const all = JSON.parse(localStorage.getItem('love-action-miss') || '[]')
  const other = auth.identity === 'her' ? 'him' : 'her'
  records.value = all.filter(r => r.author === other)
}

function formatDate(dateStr) {
  return dayjs(dateStr).format('MM月DD日 HH:mm')
}

function levelBadgeClass(level) {
  if (level >= 8) return 'bg-red-100 text-red-600'
  if (level >= 5) return 'bg-theme/10 text-theme'
  return 'bg-gray-100 text-gray-500'
}
</script>

<style scoped>
.miss-card {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
}

.miss-image {
  width: 100%;
}
</style>
