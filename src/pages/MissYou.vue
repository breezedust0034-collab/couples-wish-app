<template>
  <div class="miss-you-page min-h-dvh px-4 pb-24 pt-8 relative z-10">
    <header class="flex items-center gap-3 mb-8">
      <button @click="router.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-sakura-white/80 shadow-sm active:scale-95 transition-transform">
        <ChevronLeft :size="20" stroke="#3D1F2A" />
      </button>
      <h1 class="text-xl font-semibold text-text-primary">我想你了 💕</h1>
    </header>

    <div class="miss-form space-y-6">
      <div class="miss-level-card p-6 text-center">
        <p class="text-sm text-text-secondary mb-4">现在的思念程度是？</p>
        <div class="level-display mb-3">
          <span class="level-number" :class="levelClass">{{ form.level }}</span>
          <span class="level-unit">/ 10</span>
        </div>
        <input
          type="range"
          v-model="form.level"
          min="0"
          max="10"
          step="1"
          class="level-slider w-full"
        />
        <div class="flex justify-between text-xs text-text-secondary mt-1">
          <span>一点点</span>
          <span>超级想你</span>
        </div>
      </div>

      <div class="form-card p-5">
        <label class="block text-sm font-medium text-text-primary mb-2">想说的话</label>
        <textarea
          v-model="form.message"
          maxlength="300"
          rows="4"
          placeholder="此刻想TA的心情..."
          class="w-full px-4 py-3 rounded-xl bg-bg-main border border-accent-pink/30 focus:border-theme focus:outline-none text-sm resize-none"
        ></textarea>
        <p class="text-xs text-text-secondary mt-1 text-right">{{ form.message.length }}/300</p>
      </div>

      <div class="form-card p-5">
        <label class="block text-sm font-medium text-text-primary mb-2">配一张图（可选）</label>
        <div class="image-upload-area" @click="triggerImageUpload">
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageSelect"
          />
          <img v-if="form.image" :src="form.image" class="upload-preview" />
          <div v-else class="upload-placeholder">
            <ImageIcon :size="32" stroke="#E87FA5" stroke-width="1" />
            <p class="text-xs text-theme mt-2">点击上传图片</p>
          </div>
        </div>
        <div v-if="form.image" class="flex justify-end mt-2">
          <button @click="form.image = ''" class="text-xs text-text-secondary active:underline">移除图片</button>
        </div>
      </div>

      <button
        type="button"
        @click="handleSend"
        class="btn-miss-send w-full py-5 rounded-xl text-white text-lg font-semibold shadow-lg pulse-strong active:scale-96 transition-transform"
        :disabled="submitting"
      >
        {{ submitting ? '发送中...' : '我想你了 💕' }}
      </button>
    </div>

    <div v-if="showSuccess" class="success-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-main/90 backdrop-blur-sm">
      <p class="text-red-500 text-lg font-semibold mb-2">想念已送达 💕</p>
      <p class="text-text-secondary text-sm">TA会收到的</p>
      <button @click="goHome" class="mt-6 px-6 py-2.5 rounded-xl bg-theme text-white text-sm active:scale-95 transition-transform">返回主页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Image as ImageIcon } from 'lucide-vue-next'
import { useWishesStore } from '@/store/wishes'
import { useAuthStore } from '@/store/auth'
import { notifyMiss } from '@/utils/notify'

const router = useRouter()
const wishesStore = useWishesStore()
const auth = useAuthStore()
const submitting = ref(false)
const showSuccess = ref(false)
const imageInput = ref(null)

const form = reactive({
  level: 5,
  message: '',
  image: '',
})

const levelClass = computed(() => {
  const l = form.level
  if (l >= 8) return 'level-high'
  if (l >= 5) return 'level-mid'
  if (l >= 2) return 'level-low'
  return 'level-none'
})

function triggerImageUpload() {
  imageInput.value?.click()
}

function handleImageSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    alert('图片不能超过 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    form.image = reader.result
  }
  reader.readAsDataURL(file)
}

async function handleSend() {
  submitting.value = true
  try {
    const record = {
      id: 'm' + Date.now(),
      author: auth.identity,
      type: 'miss',
      level: form.level,
      message: form.message || null,
      image: form.image || null,
      status: 'sent',
      created_at: new Date().toISOString(),
    }

    const allRecords = loadMissRecords()
    allRecords.unshift(record)
    localStorage.setItem('love-action-miss', JSON.stringify(allRecords))

    notifyMiss(auth.identity, form.level, form.message)

    showSuccess.value = true
    form.message = ''
    form.image = ''
    form.level = 5
  } catch (err) {
    alert('发送失败：' + err.message)
  } finally {
    submitting.value = false
  }
}

function loadMissRecords() {
  const stored = localStorage.getItem('love-action-miss')
  if (stored) {
    try { return JSON.parse(stored) } catch { return [] }
  }
  return []
}

function goHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.form-card, .miss-level-card {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
}

.level-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.level-number {
  font-family: "Ma Shan Zheng", cursive;
  font-size: 4rem;
  line-height: 1;
  transition: color 0.3s;
}

.level-high { color: #D9305C; }
.level-mid { color: #E87FA5; }
.level-low { color: #F4B8CE; }
.level-none { color: #E0D0D5; }

.level-unit {
  font-size: 1rem;
  color: #9C7080;
}

.level-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #FDE8F0, #E87FA5, #D9305C);
  outline: none;
}

.level-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: 3px solid #E87FA5;
  box-shadow: 0 2px 8px rgba(232, 127, 165, 0.3);
  cursor: pointer;
}

.image-upload-area {
  border: 2px dashed rgba(232, 127, 165, 0.3);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.image-upload-area:hover {
  border-color: #E87FA5;
}

.upload-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn-miss-send {
  background: linear-gradient(135deg, #D9305C, #E87FA5);
}

.pulse-strong {
  animation: pulse-strong 1.5s ease-in-out infinite;
}

@keyframes pulse-strong {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
</style>
