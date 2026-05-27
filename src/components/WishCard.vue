<template>
  <div
    class="wish-card cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    :class="statusClass"
    @click="$emit('click', wish)"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span class="category-icon text-lg">{{ categoryIcon }}</span>
          <h3 class="text-base font-semibold text-text-primary truncate">{{ wish.title }}</h3>
        </div>
        <p class="text-sm text-text-secondary line-clamp-2 mb-2">{{ wish.description || '暂无详情' }}</p>
        <div class="flex items-center gap-2 text-xs text-text-secondary">
          <span class="author-tag px-2 py-0.5 rounded-full bg-bg-secondary">{{ wish.author === 'her' ? '她' : '他' }}</span>
          <span>{{ formatDate(wish.created_at) }}</span>
          <div class="flex items-center gap-0.5 ml-auto">
            <Heart :size="12" :fill="wish.urgency >= 1 ? '#E87FA5' : 'none'" stroke="#E87FA5" />
            <Heart :size="12" :fill="wish.urgency >= 2 ? '#E87FA5' : 'none'" stroke="#E87FA5" />
            <Heart :size="12" :fill="wish.urgency >= 3 ? '#E87FA5' : 'none'" stroke="#E87FA5" />
            <Heart :size="12" :fill="wish.urgency >= 4 ? '#E87FA5' : 'none'" stroke="#E87FA5" />
            <Heart :size="12" :fill="wish.urgency >= 5 ? '#E87FA5' : 'none'" stroke="#E87FA5" />
          </div>
        </div>
      </div>
      <span class="status-badge text-xs px-2.5 py-1 rounded-full whitespace-nowrap">{{ statusText }}</span>
    </div>
    <div v-if="wish.note" class="mt-3 pt-3 border-t border-accent-pink/20">
      <p class="text-xs text-theme italic">"{{ wish.note }}"</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Heart } from 'lucide-vue-next'
import dayjs from 'dayjs'

const props = defineProps({
  wish: { type: Object, required: true }
})
defineEmits(['click'])

const categoryMap = { eat: '🍜', play: '🎮', do: '🌸' }
const categoryIcon = computed(() => categoryMap[props.wish.category] || '🌸')

const statusMap = {
  pending: { text: '待接单', class: 'bg-bg-secondary text-theme border border-accent-pink/30' },
  confirmed: { text: '已接单', class: 'bg-theme/10 text-theme-deep border border-theme/30' },
  rejected: { text: '婉拒', class: 'bg-gray-100 text-text-secondary border border-gray-200' },
  done: { text: '已完成', class: 'bg-gold/10 text-gold border border-gold/30' },
}

const statusText = computed(() => statusMap[props.wish.status]?.text || '待接单')
const statusClass = computed(() => statusMap[props.wish.status]?.class || '')

function formatDate(dateStr) {
  return dayjs(dateStr).format('MM月DD日')
}
</script>

<style scoped>
.wish-card {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
  padding: 20px;
}
</style>
