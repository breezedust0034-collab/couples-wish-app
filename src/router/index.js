import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'entry', component: () => import('@/pages/EntryPage.vue') },
  { path: '/home', name: 'home', component: () => import('@/pages/HomePage.vue'), meta: { requiresAuth: true } },
  { path: '/wish/new', name: 'wish-new', component: () => import('@/pages/WishNew.vue'), meta: { requiresAuth: true } },
  { path: '/wish/inbox', name: 'wish-inbox', component: () => import('@/pages/WishInbox.vue'), meta: { requiresAuth: true } },
  { path: '/wish/sent', name: 'wish-sent', component: () => import('@/pages/WishSent.vue'), meta: { requiresAuth: true } },
  { path: '/wish/:id', name: 'wish-detail', component: () => import('@/pages/WishDetail.vue'), meta: { requiresAuth: true } },
  { path: '/miss', name: 'miss-you', component: () => import('@/pages/MissYou.vue'), meta: { requiresAuth: true } },
  { path: '/miss/received', name: 'miss-received', component: () => import('@/pages/MissReceived.vue'), meta: { requiresAuth: true } },
  { path: '/memories', name: 'memories', component: () => import('@/pages/MemoriesPage.vue'), meta: { requiresAuth: true } },
  { path: '/memories/:id', name: 'memory-detail', component: () => import('@/pages/MemoryDetail.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('wish-token')
    if (!token) {
      next({ name: 'entry' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
