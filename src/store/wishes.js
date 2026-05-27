import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

const STORAGE_KEY = 'love-action-wishes'

const mockWishes = [
  {
    id: 'w1', author: 'her', title: '想吃寿喜锅', category: 'eat',
    description: '冬天最适合吃热乎乎的寿喜锅了，你来做给我吃好不好~',
    desired_at: '', urgency: 4, note: '上次在日本吃到的那家超好吃！',
    status: 'done', reply_msg: '没问题，我来做！', confirm_time: '',
    done_msg: '第一次做，她很开心！',
    done_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'w2', author: 'him', title: '一起去看烟花', category: 'play',
    description: '听说跨年有烟花表演，我们一起去吧！',
    desired_at: '', urgency: 5, note: '想和你一起倒数跨年',
    status: 'done', reply_msg: '好呀！', confirm_time: '',
    done_msg: '烟花好美，但更美的是身边的人',
    done_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'w3', author: 'her', title: '在家窝着看电影', category: 'do',
    description: '周末不想出门，想和你一起在家看一整天的电影',
    desired_at: '', urgency: 3, note: '爆米花我来准备！',
    status: 'confirmed', reply_msg: '好，我来选片单', confirm_time: '',
    done_msg: '', done_at: '',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'w4', author: 'him', title: '想让你做蛋糕', category: 'eat',
    description: '生日快到了，想要你亲手做的蛋糕',
    desired_at: '', urgency: 5, note: '',
    status: 'pending', reply_msg: '', confirm_time: '',
    done_msg: '', done_at: '',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'w5', author: 'her', title: '想去游乐园', category: 'play',
    description: '好久没去游乐园了，想去坐摩天轮和旋转木马',
    desired_at: '', urgency: 4, note: '还要拍好多照片！',
    status: 'pending', reply_msg: '', confirm_time: '',
    done_msg: '', done_at: '',
    created_at: new Date().toISOString(),
  },
  {
    id: 'w6', author: 'him', title: '一起散步看落叶', category: 'do',
    description: '秋天的公园一定很美，我们一起去散步吧',
    desired_at: '', urgency: 3, note: '记得带相机！',
    status: 'rejected', reply_msg: '最近太忙了，等周末再说好不好', confirm_time: '',
    done_msg: '', done_at: '',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
]

function loadWishes() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try { return JSON.parse(stored) } catch { return mockWishes }
  }
  return mockWishes
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
      return newWish
    },

    async confirmWish(id, replyMsg, confirmTime) {
      const wish = this.wishes.find(w => w.id === id)
      if (wish) {
        wish.status = 'confirmed'
        wish.reply_msg = replyMsg
        wish.confirm_time = confirmTime
        saveWishes(this.wishes)
      }
    },

    async rejectWish(id, replyMsg) {
      const wish = this.wishes.find(w => w.id === id)
      if (wish) {
        wish.status = 'rejected'
        wish.reply_msg = replyMsg
        saveWishes(this.wishes)
      }
    },

    async completeWish(id, doneMsg) {
      const wish = this.wishes.find(w => w.id === id)
      if (wish) {
        wish.status = 'done'
        wish.done_msg = doneMsg
        wish.done_at = new Date().toISOString()
        saveWishes(this.wishes)
      }
    },

    async fetchStats() {
      const done = this.wishes.filter(w => w.status === 'done')
      const allDates = this.wishes.map(w => new Date(w.created_at)).sort((a, b) => a - b)
      const firstDate = allDates.length ? allDates[0] : new Date()
      const daysTogether = Math.floor((new Date() - firstDate) / 86400000)

      return {
        daysTogether: daysTogether || 100,
        totalDone: done.length,
        eatCount: done.filter(w => w.category === 'eat').length,
        playCount: done.filter(w => w.category === 'play').length,
        doCount: done.filter(w => w.category === 'do').length,
      }
    },
  },
})
