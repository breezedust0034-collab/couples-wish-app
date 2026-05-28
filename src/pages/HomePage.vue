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
          <p class="days-number text-theme">{{ wishesStore.pendingCount }}</p>
          <p class="text-xs text-text-secondary">待处理</p>
        </div>
      </div>
    </div>

    <div class="miss-section mb-6">
      <div class="miss-quick-card p-5 text-center relative overflow-hidden" ref="missCardRef">
        <div class="miss-counts flex justify-center gap-8 mb-4">
          <div>
            <p class="miss-count-number">{{ missStore.myCount }}</p>
            <p class="text-xs text-text-secondary">我想你</p>
          </div>
          <div class="w-px bg-accent-pink/20"></div>
          <div>
            <p class="miss-count-number text-red-500">{{ missStore.otherCount }}</p>
            <p class="text-xs text-text-secondary">TA想你</p>
          </div>
        </div>
        <button
          @click="handleQuickMiss"
          class="miss-quick-btn relative px-10 py-4 rounded-2xl text-white text-xl font-semibold shadow-xl pulse-strong active:scale-95 transition-transform"
          ref="missBtnRef"
        >
          💕 我想你了
        </button>
      </div>
    </div>

    <div class="action-buttons flex flex-col gap-3">
      <button
        @click="router.push({ name: 'wish-new' })"
        class="btn-wish w-full py-4 rounded-xl text-white text-base font-semibold shadow-lg active:scale-96 transition-transform flex items-center justify-center gap-2 pulse-medium"
      >
        <span class="text-xl">🌸</span> 许下心愿
      </button>

      <div class="flex gap-3">
        <button
          @click="router.push({ name: 'wish-inbox' })"
          class="btn-secondary flex-1 py-4 rounded-xl text-theme text-sm font-semibold shadow-lg active:scale-96 transition-transform flex items-center justify-center gap-1.5 relative pulse-soft"
        >
          <span>💌</span> TA的心愿
          <span v-if="wishesStore.pendingCount > 0" class="badge-red">{{ wishesStore.pendingCount }}</span>
        </button>

        <button
          @click="router.push({ name: 'miss-received' })"
          class="btn-secondary flex-1 py-4 rounded-xl text-red-400 text-sm font-semibold shadow-lg active:scale-96 transition-transform flex items-center justify-center gap-1.5 relative pulse-soft"
        >
          <span>💌</span> 收到的想念
          <span v-if="missStore.otherCount > 0" class="badge-miss">{{ missStore.otherCount }}</span>
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
import { useMissStore } from '@/store/miss'
import gsap from 'gsap'

const router = useRouter()
const auth = useAuthStore()
const wishesStore = useWishesStore()
const missStore = useMissStore()
const stats = ref({ daysTogether: 0, totalDone: 0, eatCount: 0, playCount: 0, doCount: 0 })
const missBtnRef = ref(null)
const missCardRef = ref(null)

onMounted(async () => {
  await Promise.all([
    wishesStore.fetchWishes(),
    missStore.fetchRecords(),
    loadStats(),
  ])
})

async function loadStats() {
  stats.value = await wishesStore.fetchStats()
}

async function handleQuickMiss() {
  await missStore.quickMiss()
  burstHearts()
}

function burstHearts() {
  const btn = missBtnRef.value
  if (!btn) return

  const rect = btn.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  for (let i = 0; i < 12; i++) {
    const heart = document.createElement('div')
    heart.textContent = ['💕', '💗', '❤️', '💖', '💘'][Math.floor(Math.random() * 5)]
    heart.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${14 + Math.random() * 14}px;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(heart)

    const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.5
    const distance = 60 + Math.random() * 80

    gsap.to(heart, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 40,
      opacity: 0,
      scale: 0.3,
      rotation: Math.random() * 360,
      duration: 0.8 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => heart.remove(),
    })
  }

  gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
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

.miss-quick-card {
  background: linear-gradient(135deg, rgba(253, 232, 240, 0.9), rgba(255, 250, 252, 0.9));
  border: 1px solid rgba(217, 48, 92, 0.2);
  border-radius: var(--radius-card);
  box-shadow: 0 4px 24px rgba(217, 48, 92, 0.1);
  backdrop-filter: blur(8px);
}

.miss-count-number {
  font-family: "Ma Shan Zheng", cursive;
  font-size: 2rem;
  color: #D9305C;
  line-height: 1;
}

.miss-quick-btn {
  background: linear-gradient(135deg, #D9305C, #E87FA5);
}

.btn-wish {
  background: linear-gradient(135deg, #E87FA5, #C4637E);
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
