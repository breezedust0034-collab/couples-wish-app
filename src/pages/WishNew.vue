<template>
  <div class="wish-new-page min-h-dvh px-4 pb-24 pt-8 relative z-10">
    <header class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-sakura-white/80 shadow-sm active:scale-95 transition-transform">
        <ChevronLeft :size="20" stroke="#3D1F2A" />
      </button>
      <h1 class="text-xl font-semibold text-text-primary">许下心愿 🌸</h1>
    </header>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div class="form-card p-5">
        <label class="block text-sm font-medium text-text-primary mb-2">心愿标题 <span class="text-theme">*</span></label>
        <input
          v-model="form.title"
          type="text"
          maxlength="50"
          placeholder="例如：想吃麻辣香锅"
          class="w-full px-4 py-3 rounded-xl bg-bg-main border border-accent-pink/30 focus:border-theme focus:outline-none text-sm"
          required
        />
        <p class="text-xs text-text-secondary mt-1 text-right">{{ form.title.length }}/50</p>
      </div>

      <div class="form-card p-5">
        <label class="block text-sm font-medium text-text-primary mb-3">心愿分类 <span class="text-theme">*</span></label>
        <div class="flex gap-3">
          <button
            v-for="cat in categories"
            :key="cat.value"
            type="button"
            @click="form.category = cat.value"
            class="flex-1 py-3 rounded-xl border transition-all active:scale-95 text-sm"
            :class="form.category === cat.value ? 'border-theme bg-theme/10 text-theme font-semibold' : 'border-accent-pink/30 bg-sakura-white text-text-secondary'"
          >
            <div class="text-2xl mb-1">{{ cat.icon }}</div>
            <div>{{ cat.label }}</div>
          </button>
        </div>
      </div>

      <div class="form-card p-5">
        <label class="block text-sm font-medium text-text-primary mb-2">心愿详情</label>
        <textarea
          v-model="form.description"
          maxlength="200"
          rows="3"
          placeholder="补充说明一下..."
          class="w-full px-4 py-3 rounded-xl bg-bg-main border border-accent-pink/30 focus:border-theme focus:outline-none text-sm resize-none"
        ></textarea>
        <p class="text-xs text-text-secondary mt-1 text-right">{{ form.description.length }}/200</p>
      </div>

      <div class="form-card p-5">
        <label class="block text-sm font-medium text-text-primary mb-2">期望时间</label>
        <input
          v-model="form.desired_at"
          type="date"
          class="w-full px-4 py-3 rounded-xl bg-bg-main border border-accent-pink/30 focus:border-theme focus:outline-none text-sm"
        />
      </div>

      <div class="form-card p-5">
        <label class="block text-sm font-medium text-text-primary mb-3">心情值 <span class="text-theme">*</span></label>
        <p class="text-xs text-text-secondary mb-2">表达这个心愿有多迫切</p>
        <HeartRating v-model="form.urgency" />
      </div>

      <div class="form-card p-5">
        <label class="block text-sm font-medium text-text-primary mb-2">悄悄话</label>
        <input
          v-model="form.note"
          type="text"
          maxlength="100"
          placeholder="写给TA的小话..."
          class="w-full px-4 py-3 rounded-xl bg-bg-main border border-accent-pink/30 focus:border-theme focus:outline-none text-sm"
        />
        <p class="text-xs text-text-secondary mt-1 text-right">{{ form.note.length }}/100</p>
      </div>

      <button
        type="submit"
        class="btn-submit w-full py-4 rounded-xl text-white text-base font-semibold shadow-lg active:scale-96 transition-transform"
        :disabled="submitting"
      >
        {{ submitting ? '送出中...' : '送出心愿 🌸' }}
      </button>
    </form>

    <div v-if="showSuccess" class="success-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-main/90 backdrop-blur-sm">
      <p class="text-theme text-lg font-semibold mb-2">心愿已悄悄送出</p>
      <p class="text-text-secondary text-sm">等 TA 来接 🌸</p>
      <button @click="goHome" class="mt-6 px-6 py-2.5 rounded-xl bg-theme text-white text-sm active:scale-95 transition-transform">返回主页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import { useWishesStore } from '@/store/wishes'
import HeartRating from '@/components/HeartRating.vue'

const router = useRouter()
const wishesStore = useWishesStore()
const submitting = ref(false)
const showSuccess = ref(false)

const categories = [
  { value: 'eat', icon: '🍜', label: '吃什么' },
  { value: 'play', icon: '🎮', label: '玩什么' },
  { value: 'do', icon: '🌸', label: '做什么' },
]

const form = reactive({
  title: '',
  category: '',
  description: '',
  desired_at: '',
  urgency: 3,
  note: '',
})

async function handleSubmit() {
  if (!form.title || !form.category) return
  submitting.value = true
  try {
    await wishesStore.createWish({
      title: form.title,
      category: form.category,
      description: form.description || null,
      desired_at: form.desired_at || null,
      urgency: form.urgency,
      note: form.note || null,
    })
    showSuccess.value = true
  } catch (err) {
    alert('提交失败：' + err.message)
  } finally {
    submitting.value = false
  }
}

function goHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.form-card {
  background: rgba(255, 250, 252, 0.85);
  border: 1px solid rgba(232, 127, 165, 0.25);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
}

.btn-submit {
  background: linear-gradient(135deg, #E87FA5, #C4637E);
}
</style>
