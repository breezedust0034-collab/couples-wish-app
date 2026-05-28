import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { supabase, isSupabaseReady } from '@/utils/supabase'
import { notifyNewWish, notifyConfirm, notifyReject, notifyComplete } from '@/utils/notify'

const STORAGE_KEY = 'love-action-wishes'

function loadLocal() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) { try { return JSON.parse(stored) } catch { return [] } }
  return []
}

function saveLocal(wishes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes))
}

export const useWishesStore = defineStore('wishes', {
  state: () => ({
    wishes: loadLocal(),
    loading: false,
    lastNotify: null,
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
      if (isSupabaseReady) {
        const { data, error } = await supabase.from('wishes').select('*').order('created_at', { ascending: false })
        if (!error && data) { this.wishes = data; saveLocal(data) }
      } else {
        this.wishes = loadLocal()
      }
      this.loading = false
    },

    async createWish(wishData) {
      const auth = useAuthStore()
      const newWish = {
        ...wishData,
        author: auth.identity,
        status: 'pending',
        reply_msg: null,
        confirm_time: null,
        done_msg: null,
        done_at: null,
      }

      if (isSupabaseReady) {
        const { data, error } = await supabase.from('wishes').insert([newWish]).select().single()
        if (error) throw error
        this.wishes = [data, ...this.wishes]
        saveLocal(this.wishes)
        notifyNewWish(auth.identity, wishData.title, wishData.category, wishData.note)
        return data
      } else {
        newWish.id = 'w' + Date.now()
        newWish.created_at = new Date().toISOString()
        this.wishes = [newWish, ...this.wishes]
        saveLocal(this.wishes)
        notifyNewWish(auth.identity, wishData.title, wishData.category, wishData.note)
        return newWish
      }
    },

    async confirmWish(id, replyMsg, confirmTime) {
      const updates = { status: 'confirmed', reply_msg: replyMsg, confirm_time: confirmTime }
      if (isSupabaseReady) {
        const { error } = await supabase.from('wishes').update(updates).eq('id', id)
        if (error) throw error
      }
      const wish = this.wishes.find(w => w.id === id)
      if (wish) {
        Object.assign(wish, updates)
        saveLocal(this.wishes)
        notifyConfirm(wish.author, wish.title, replyMsg)
      }
    },

    async rejectWish(id, replyMsg) {
      const updates = { status: 'rejected', reply_msg: replyMsg }
      if (isSupabaseReady) {
        const { error } = await supabase.from('wishes').update(updates).eq('id', id)
        if (error) throw error
      }
      const wish = this.wishes.find(w => w.id === id)
      if (wish) {
        Object.assign(wish, updates)
        saveLocal(this.wishes)
        notifyReject(wish.author, wish.title, replyMsg)
      }
    },

    async completeWish(id, doneMsg) {
      const updates = { status: 'done', done_msg: doneMsg, done_at: new Date().toISOString() }
      if (isSupabaseReady) {
        const { error } = await supabase.from('wishes').update(updates).eq('id', id)
        if (error) throw error
      }
      const wish = this.wishes.find(w => w.id === id)
      if (wish) {
        Object.assign(wish, updates)
        saveLocal(this.wishes)
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
