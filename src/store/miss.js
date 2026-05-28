import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { supabase, isSupabaseReady } from '@/utils/supabase'
import { notifyMiss } from '@/utils/notify'

const STORAGE_KEY = 'love-action-miss'

function loadLocal() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) { try { return JSON.parse(stored) } catch { return [] } }
  return []
}

function saveLocal(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export const useMissStore = defineStore('miss', {
  state: () => ({
    records: loadLocal(),
    loading: false,
  }),

  getters: {
    myCount: (state) => {
      const auth = useAuthStore()
      return state.records.filter(r => r.author === auth.identity).length
    },
    otherCount: (state) => {
      const auth = useAuthStore()
      const other = auth.identity === 'her' ? 'him' : 'her'
      return state.records.filter(r => r.author === other).length
    },
    otherRecords: (state) => {
      const auth = useAuthStore()
      const other = auth.identity === 'her' ? 'him' : 'her'
      return state.records.filter(r => r.author === other).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
  },

  actions: {
    async fetchRecords() {
      this.loading = true
      if (isSupabaseReady) {
        const { data, error } = await supabase.from('miss_records').select('*').order('created_at', { ascending: false })
        if (!error && data) { this.records = data; saveLocal(data) }
      } else {
        this.records = loadLocal()
      }
      this.loading = false
    },

    async quickMiss() {
      const auth = useAuthStore()
      const record = {
        author: auth.identity,
        level: 5,
        message: null,
        image: null,
      }

      if (isSupabaseReady) {
        const { data, error } = await supabase.from('miss_records').insert([record]).select().single()
        if (error) throw error
        this.records = [data, ...this.records]
        saveLocal(this.records)
      } else {
        record.id = 'm' + Date.now()
        record.created_at = new Date().toISOString()
        this.records = [record, ...this.records]
        saveLocal(this.records)
      }

      notifyMiss(auth.identity, 5, null)
      return true
    },

    async sendMiss(level, message, image) {
      const auth = useAuthStore()
      const record = {
        author: auth.identity,
        level,
        message: message || null,
        image: image || null,
      }

      if (isSupabaseReady) {
        const { data, error } = await supabase.from('miss_records').insert([record]).select().single()
        if (error) throw error
        this.records = [data, ...this.records]
        saveLocal(this.records)
      } else {
        record.id = 'm' + Date.now()
        record.created_at = new Date().toISOString()
        this.records = [record, ...this.records]
        saveLocal(this.records)
      }

      notifyMiss(auth.identity, level, message)
      return true
    },
  },
})
