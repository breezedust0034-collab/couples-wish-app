<template>
  <div class="home-page min-h-dvh px-4 pb-24 pt-8 relative z-10">
    <header class="text-center mb-6">
      <h1 class="text-3xl font-brand text-theme mb-1">只为你</h1>
      <p class="text-text-secondary text-xs">{{ auth.displayName }}的心愿空间</p>
    </header>

    <div class="stats-card mb-6">
      <div class="flex justify-around text-center">
        <div>
          <p class="days-number">{{ stats.daysTogether || 0 }}</p>
          <p class="text-xs text-text-secondary">在一起天数</p>
        </div>
        <div class="w-px bg-accent-pink/30"></div>
        <div>
          <p class="days-number text-gold">{{ stats.totalDone || 0 }}</p>
          <p class="text-xs text-text-secondary">已完成心愿</p>
        </div>
        <div class="w-px bg-accent-pink/30"></div>
        <div>
          <p class="days-number text-theme">{{ wishesStore.pendingCount + missCount }}</p>
          <p class="text-xs text-text-secondary">待处理</p>
        </div>
      </div>
    </div>

    <div class="action-buttons flex flex-col gap-3">
      <button
        @click="router.push({ name: 'wish-new' })"
        class="btn-wish w-full py-4 rounded-xl text-white text-base font-semibold shadow-lg active:scale-96 transition-transform flex items-center justify-center gap-2 pulse-medium"
      >
        <span class="text-xl">🌸</span> 许下心愿
      </button>

      <button
        @click="router.push({ name: 'miss-you' })"
        class="btn-miss w-full py-5 rounded-xl text-white text-lg font-semibold shadow-lg active:scale-96 transition-transform flex items-center justify-center gap-2 pulse-strong"
      >
        <span class="text-2xl">💕</span> 我想你了
      </button>

      <div class="flex gap-3">
        <button
          @click="router.push({ name: 'wish-inbox' })"
          class="btn-secondary flex-1 py-4 rounded-xl text-theme text-sm font-semibold shadow-lg active:scale-96 transition-transform flex items-center justify-center gap-1.5 relative pulse-soft"
        >
          <span>💌</span> TA的心愿
          <span v-if="wishesStore.pendingCount > 0" class="badge-red">
            {{ wishesStore.pendingCount }}
          </span>
        </button>

        <button
          @click="router.push({ name: 'miss-received' })"
          class="btn-secondary flex-1 py-4 rounded-xl text-red-400 text-sm font-semibold shadow-lg active:scale-96 transition-transform flex items-center justify-center gap-1.5 relative pulse-soft"
        >
          <span>💌</span> 收到的想念
          <span v-if="missCount > 0" class="badge-miss">
            {{ missCount }}
          </span>
        </button>
      </div>

      <div class="flex gap-3">
        <button
          @click="router.push({ name: 'wish-sent' })"
          class="btn-secondary flex-1 py-3.5 rounded-xl text-theme text-sm font-semibold shadow active:scale-96 transition-transform flex items-center justify-center gap-1.5 pulse-soft"
        >
          <span>📝</span> 我发出的
        </button>

        <button
          @click="router.push({ name: 'memories' })"
          class="btn-secondary flex-1 py-3.5 rounded-xl text-gold text-sm font-semibold shadow active:scale-96 transition-transform flex items-center justify-center gap-1.5 pulse-soft"
        >
          <span>📖</span> 回忆册
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useWishesStore } from '@/store/wishes'

const router = useRouter()
const auth = useAuthStore()
const wishesStore = useWishesStore()
const stats = ref({ daysTogether: 0, totalDone: 0, eatCount: 0, playCount: 0, doCount: 0 })
const missCount = ref(0)

onMounted(async () => {
  await Promise.all([
    wishesStore.fetchWishes(),
    loadStats(),
    loadMissCount(),
  ])
})

async function loadStats() {
  stats.value = await wishesStore.fetchStats()
}

function loadMissCount() {
  const all = JSON.parse(localStorage.getItem('love-action-miss') || '[]')
  const other = auth.identity === 'her' ? 'him' : 'her'
  missCount.value = all.filter(r => r.author === other).length
}
</script>

<style scoped>
.stats-card {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
  padding: 24px 20px;
}

.days-number {
  font-family: "Ma Shan Zheng", cursive;
  font-size: 2.5rem;
  color: var(--color-theme-deep, #C4637E);
  line-height: 1;
}

.btn-wish {
  background: linear-gradient(135deg, #E87FA5, #C4637E);
}

.btn-miss {
  background: linear-gradient(135deg, #D9305C, #E87FA5);
}

.btn-secondary {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  backdrop-filter: blur(8px);
}

.badge-red {
  position: absolute;
  right: 10px;
  top: -6px;
  background: #E87FA5;
  color: white;
  font-size: 11px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-miss {
  position: absolute;
  right: 10px;
  top: -6px;
  background: #D9305C;
  color: white;
  font-size: 11px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-strong {
  animation: pulse-strong 1.5s ease-in-out infinite;
}

@keyframes pulse-strong {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

.pulse-medium {
  animation: pulse-medium 2s ease-in-out infinite;
}

@keyframes pulse-medium {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.025); }
}

.pulse-soft {
  animation: pulse-soft 3s ease-in-out infinite;
}

@keyframes pulse-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
}
</style>
