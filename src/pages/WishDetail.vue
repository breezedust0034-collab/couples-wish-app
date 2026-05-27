<template>
  <div class="wish-detail-page min-h-dvh px-4 pb-24 pt-8 relative z-10">
    <header class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-sakura-white/80 shadow-sm active:scale-95 transition-transform">
        <ChevronLeft :size="20" stroke="#3D1F2A" />
      </button>
      <h1 class="text-xl font-semibold text-text-primary">心愿详情</h1>
    </header>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="wish" class="space-y-4">
      <div class="detail-card p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">{{ categoryIcon }}</span>
          <h2 class="text-lg font-semibold text-text-primary">{{ wish.title }}</h2>
        </div>

        <div class="flex items-center gap-3 mb-4">
          <span class="status-badge text-xs px-2.5 py-1 rounded-full" :class="statusClass">{{ statusText }}</span>
          <span class="author-tag text-xs px-2 py-0.5 rounded-full bg-bg-secondary">{{ wish.author === 'her' ? '她' : '他' }}的心愿</span>
        </div>

        <p v-if="wish.description" class="text-sm text-text-secondary leading-relaxed mb-4">{{ wish.description }}</p>

        <div class="flex items-center gap-4 text-sm text-text-secondary">
          <span v-if="wish.desired_at">期望时间：{{ wish.desired_at }}</span>
          <div class="flex items-center gap-1">
            <span class="text-xs">心情：</span>
            <Heart v-for="i in 5" :key="i" :size="14" :fill="i <= wish.urgency ? '#E87FA5' : 'none'" stroke="#E87FA5" />
          </div>
        </div>

        <div v-if="wish.note" class="mt-4 pt-4 border-t border-accent-pink/20">
          <p class="text-xs text-text-secondary mb-1">悄悄话：</p>
          <p class="text-sm text-theme italic">"{{ wish.note }}"</p>
        </div>

        <div v-if="wish.reply_msg" class="mt-4 pt-4 border-t border-accent-pink/20">
          <p class="text-xs text-text-secondary mb-1">回复：</p>
          <p class="text-sm text-text-primary">"{{ wish.reply_msg }}"</p>
        </div>

        <div v-if="wish.done_msg" class="mt-4 pt-4 border-t border-accent-pink/20">
          <p class="text-xs text-text-secondary mb-1">完成感言：</p>
          <p class="text-sm text-gold">"{{ wish.done_msg }}"</p>
        </div>
      </div>

      <div v-if="canAct" class="action-buttons space-y-3">
        <button
          v-if="wish.status === 'pending'"
          @click="handleConfirm"
          class="btn-action w-full py-4 rounded-xl text-white text-base font-semibold shadow-lg active:scale-96 transition-transform"
        >
          这个我来！💕
        </button>

        <button
          v-if="wish.status === 'pending'"
          @click="showRejectModal = true"
          class="btn-reject w-full py-4 rounded-xl text-text-secondary text-base font-semibold shadow-lg active:scale-96 transition-transform border border-accent-pink/20"
        >
          这次暂时不行…
        </button>

        <button
          v-if="wish.status === 'confirmed'"
          @click="handleComplete"
          class="btn-complete w-full py-4 rounded-xl text-white text-base font-semibold shadow-lg active:scale-96 transition-transform"
        >
          已兑现 🎉
        </button>
      </div>
    </div>

    <div v-else class="text-center py-16 text-text-secondary">
      <p class="text-4xl mb-3">🌸</p>
      <p class="text-sm">未找到该心愿</p>
    </div>

    <div v-if="showRejectModal" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" @click.self="showRejectModal = false">
      <div class="modal-card w-full max-w-sm p-5">
        <h3 class="text-lg font-semibold text-text-primary mb-4">婉拒原因</h3>
        <textarea
          v-model="rejectReason"
          rows="3"
          placeholder="告诉TA为什么这次不行..."
          class="w-full px-4 py-3 rounded-xl bg-bg-main border border-accent-pink/30 focus:border-theme focus:outline-none text-sm resize-none"
        ></textarea>
        <p class="text-xs text-text-secondary mt-1">必填，要说明原因哦</p>
        <div class="flex gap-3 mt-4">
          <button @click="showRejectModal = false" class="flex-1 py-3 rounded-xl border border-accent-pink/30 text-text-secondary text-sm">取消</button>
          <button @click="handleReject" class="flex-1 py-3 rounded-xl bg-theme text-white text-sm">确认婉拒</button>
        </div>
      </div>
    </div>

    <div v-if="showConfirmModal" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" @click.self="showConfirmModal = false">
      <div class="modal-card w-full max-w-sm p-5">
        <h3 class="text-lg font-semibold text-text-primary mb-4">接单确认</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-text-secondary mb-1 block">留言（可选）</label>
            <input v-model="confirmMsg" type="text" maxlength="100" placeholder="想对TA说的话..." class="w-full px-4 py-3 rounded-xl bg-bg-main border border-accent-pink/30 focus:border-theme focus:outline-none text-sm" />
          </div>
          <div>
            <label class="text-xs text-text-secondary mb-1 block">约定时间（可选）</label>
            <input v-model="confirmTime" type="date" class="w-full px-4 py-3 rounded-xl bg-bg-main border border-accent-pink/30 focus:border-theme focus:outline-none text-sm" />
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button @click="showConfirmModal = false" class="flex-1 py-3 rounded-xl border border-accent-pink/30 text-text-secondary text-sm">取消</button>
          <button @click="executeConfirm" class="flex-1 py-3 rounded-xl bg-theme text-white text-sm">确认接单</button>
        </div>
      </div>
    </div>

    <div v-if="showCompleteModal" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" @click.self="showCompleteModal = false">
      <div class="modal-card w-full max-w-sm p-5">
        <h3 class="text-lg font-semibold text-text-primary mb-4">完成感言</h3>
        <textarea
          v-model="completeMsg"
          rows="3"
          placeholder="写下完成感言..."
          class="w-full px-4 py-3 rounded-xl bg-bg-main border border-accent-pink/30 focus:border-theme focus:outline-none text-sm resize-none"
        ></textarea>
        <div class="flex gap-3 mt-4">
          <button @click="showCompleteModal = false" class="flex-1 py-3 rounded-xl border border-accent-pink/30 text-text-secondary text-sm">取消</button>
          <button @click="executeComplete" class="flex-1 py-3 rounded-xl bg-gold text-white text-sm">已兑现 🎉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, Heart } from 'lucide-vue-next'
import { useWishesStore } from '@/store/wishes'
import { useAuthStore } from '@/store/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const wishesStore = useWishesStore()
const auth = useAuthStore()
const loading = ref(true)

const showRejectModal = ref(false)
const showConfirmModal = ref(false)
const showCompleteModal = ref(false)
const rejectReason = ref('')
const confirmMsg = ref('')
const confirmTime = ref('')
const completeMsg = ref('')

const wish = computed(() => wishesStore.wishes.find(w => w.id === route.params.id))

const categoryMap = { eat: '🍜', play: '🎮', do: '🌸' }
const categoryIcon = computed(() => wish.value ? categoryMap[wish.value.category] : '🌸')

const statusMap = {
  pending: { text: '待接单', class: 'bg-bg-secondary text-theme border border-accent-pink/30' },
  confirmed: { text: '已接单', class: 'bg-theme/10 text-theme-deep border border-theme/30' },
  rejected: { text: '婉拒', class: 'bg-gray-100 text-text-secondary border border-gray-200' },
  done: { text: '已完成', class: 'bg-gold/10 text-gold border border-gold/30' },
}

const statusText = computed(() => wish.value ? statusMap[wish.value.status]?.text : '')
const statusClass = computed(() => wish.value ? statusMap[wish.value.status]?.class : '')

const canAct = computed(() => {
  if (!wish.value) return false
  if (wish.value.author === auth.identity) return false
  return true
})

onMounted(async () => {
  await wishesStore.fetchWishes()
  loading.value = false
})

function handleConfirm() {
  showConfirmModal.value = true
}

async function executeConfirm() {
  try {
    await wishesStore.confirmWish(route.params.id, confirmMsg.value || null, confirmTime.value || null)
    showConfirmModal.value = false
  } catch (err) {
    alert('操作失败：' + err.message)
  }
}

function handleReject() {
  if (!rejectReason.value.trim()) {
    alert('请填写婉拒原因')
    return
  }
  wishesStore.rejectWish(route.params.id, rejectReason.value)
  showRejectModal.value = false
}

function handleComplete() {
  showCompleteModal.value = true
}

async function executeComplete() {
  try {
    await wishesStore.completeWish(route.params.id, completeMsg.value || null)
    showCompleteModal.value = false
  } catch (err) {
    alert('操作失败：' + err.message)
  }
}
</script>

<style scoped>
.detail-card {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
}

.btn-action {
  background: linear-gradient(135deg, #E87FA5, #C4637E);
}

.btn-complete {
  background: linear-gradient(135deg, #E8B86D, #D4A35C);
}

.modal-card {
  background: rgba(255, 250, 252, 0.95);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
</style>
