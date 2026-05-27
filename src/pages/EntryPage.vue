<template>
  <div class="entry-page min-h-dvh flex flex-col items-center justify-center relative px-4">
    <div class="text-center">
      <h1 ref="logoRef" class="brand-logo text-5xl font-brand text-theme mb-3 opacity-0">只为你</h1>
      <p ref="subtitleRef" class="text-text-secondary text-sm opacity-0">一个只属于两个人的私密心愿空间</p>
      <p ref="taglineRef" class="text-theme-deep text-base mt-6 opacity-0 font-display italic">You wish, I fulfill.</p>

      <div ref="entryButtonsRef" class="mt-10 flex flex-col gap-3 opacity-0">
        <button @click="loginAs('her')" class="px-8 py-3 rounded-xl text-white text-base font-semibold shadow-lg active:scale-96 transition-transform" style="background:linear-gradient(135deg,#E87FA5,#C4637E)">
          🌸 我是她
        </button>
        <button @click="loginAs('him')" class="px-8 py-3 rounded-xl text-white text-base font-semibold shadow-lg active:scale-96 transition-transform" style="background:linear-gradient(135deg,#6B8FB5,#4A6F98)">
          🌸 我是他
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import gsap from 'gsap'

const router = useRouter()
const auth = useAuthStore()

const logoRef = ref(null)
const subtitleRef = ref(null)
const taglineRef = ref(null)
const entryButtonsRef = ref(null)

onMounted(() => {
  if (auth.isAuthenticated) {
    router.replace({ name: 'home' })
    return
  }

  const urlParams = new URLSearchParams(window.location.search)
  const who = urlParams.get('who')
  const token = urlParams.get('token')
  if (who && token) {
    auth.authenticate(token)
    if (auth.isAuthenticated) {
      router.replace({ name: 'home' })
      return
    }
  }

  animateEntry()
})

function loginAs(role) {
  auth.setIdentity(role, role === 'her' ? 'her-token-2026' : 'him-token-2026')
  router.replace({ name: 'home' })
}

function animateEntry() {
  const tl = gsap.timeline()
  tl.to(logoRef.value, { opacity: 1, duration: 1.5, ease: 'power2.out' })
    .to(subtitleRef.value, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')
    .to(taglineRef.value, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
    .to(entryButtonsRef.value, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
}
</script>
