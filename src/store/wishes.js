import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { notifyNewWish, notifyConfirm, notifyReject, notifyComplete } from '@/utils/notify'

const STORAGE_KEY = 'love-action-wishes'

function loadWishes() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try { return JSON.parse(stored) } catch { return [] }
  }
  return []
}

function saveWishes(wishes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes))
}

export const useWishesStore = defineStore('wishes', {
  state: () => ({
    wishes: loadWishes(),
    loading: false,
  }),

  getters: {
    pendingCount: (state) => {
      const auth = useAuthStore()
      const other = auth.identity === 'her' ? 'him' : 'her'
      return state.wishes.filter(w => w.author === other && w.status === 'pending').length
    },
    memories: (state) => {
      return state.wishes.filter(w => w.status === 'done').sort((a, b) => new Date(b.done_at) - new Date(a.done_at))
    },
  },

  actions: {
    async fetchWishes() {
      this.loading = true
      await new Promise(r => setTimeout(r, 300))
      this.wishes = loadWishes()
      this.loading = false
    },

    async createWish(wishData) {
      const auth = useAuthStore()
      const newWish = {
        ...wishData,
        id: 'w' + Date.now(),
        author: auth.identity,
        status: 'pending',
        reply_msg: null,
        confirm_time: null,
        done_msg: null,
        done_at: null,
        created_at: new Date().toISOString(),
      }
      this.wishes = [newWish, ...this.wishes]
      saveWishes(this.wishes)
      notifyNewWish(auth.identity, wishData.title, wishData.category, wishData.note)
      return newWish
    },

    async confirmWish(id, replyMsg, confirmTime) {
      const wish = this.wishes.find(w => w.id === id)
      if (wish) {
        wish.status = 'confirmed'
        wish.reply_msg = replyMsg
        wish.confirm_time = confirmTime
        saveWishes(this.wishes)
        notifyConfirm(wish.author, wish.title, replyMsg)
      }
    },

    async rejectWish(id, replyMsg) {
      const wish = this.wishes.find(w => w.id === id)
      if (wish) {
        wish.status = 'rejected'
        wish.reply_msg = replyMsg
        saveWishes(this.wishes)
        notifyReject(wish.author, wish.title, replyMsg)
      }
    },

    async completeWish(id, doneMsg) {
      const wish = this.wishes.find(w => w.id === id)
      if (wish) {
        wish.status = 'done'
        wish.done_msg = doneMsg
        wish.done_at = new Date().toISOString()
        saveWishes(this.wishes)
        notifyComplete(wish.author, wish.title, doneMsg)
      }
    },

    async fetchStats() {
      const done = this.wishes.filter(w => w.status === 'done')
      const startDate = new Date('2026-04-11')
      const daysTogether = Math.max(1, Math.floor((new Date() - startDate) / 86400000))

      return {
        daysTogether,
        totalDone: done.length,
        eatCount: done.filter(w => w.category === 'eat').length,
        playCount: done.filter(w => w.category === 'play').length,
        doCount: done.filter(w => w.category === 'do').length,
      }
    },
  },
})
