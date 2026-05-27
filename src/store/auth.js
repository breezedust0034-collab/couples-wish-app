import { defineStore } from 'pinia'

const VALID_TOKENS = { her: 'her-token-2026', him: 'him-token-2026' }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    identity: localStorage.getItem('wish-identity'),
    token: localStorage.getItem('wish-token'),
    isAuthenticated: !!localStorage.getItem('wish-token'),
  }),

  getters: {
    isHer: (state) => state.identity === 'her',
    isHim: (state) => state.identity === 'him',
    displayName: (state) => state.identity === 'her' ? '她' : '他',
  },

  actions: {
    authenticate(inputToken) {
      const urlParams = new URLSearchParams(window.location.search)
      const token = inputToken || urlParams.get('token')
      const who = urlParams.get('who')

      if (who && token) {
        const validToken = VALID_TOKENS[who]
        if (token === validToken) {
          this.setIdentity(who, token)
          return true
        }
      }

      if (this.identity && this.token) return true

      for (const [role, t] of Object.entries(VALID_TOKENS)) {
        if (token === t) {
          this.setIdentity(role, t)
          return true
        }
      }
      return false
    },

    setIdentity(identity, token) {
      this.identity = identity
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('wish-identity', identity)
      localStorage.setItem('wish-token', token)
    },

    logout() {
      this.identity = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('wish-identity')
      localStorage.removeItem('wish-token')
    },
  },
})
