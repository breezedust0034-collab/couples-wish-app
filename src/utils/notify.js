const PUSH_KEYS = {
  her: 'PDU41661TYV0ZDt1g1DnAOflkr2Nv7SwIwMfnDHpq',
  him: 'PDU41664TQRnqy1EcWmVtRHDDgIIxFzoaZVJL5L2z',
}
const PUSH_URL = 'https://api2.pushdeer.com/message/push'

const categoryNames = { eat: '🍜 吃什么', play: '🎮 玩什么', do: '🌸 做什么' }

async function sendTo(key, title, content) {
  try {
    const response = await fetch(PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pushkey: key, text: title, desp: content }),
    })
    const data = await response.json()
    return data.code === 0
  } catch {
    return false
  }
}

export async function sendNotify(author, title, content) {
  const target = author === 'her' ? 'him' : 'her'
  const success = await sendTo(PUSH_KEYS[target], title, content)
  return success
}

export async function notifyNewWish(author, title, category, note) {
  const name = author === 'her' ? '她' : '他'
  const cat = categoryNames[category] || ''
  const desc = note ? `\n悄悄话：${note}` : ''
  return await sendNotify(author, `🌸 ${name}向你许下了一个新心愿`, `${cat}\n${title}${desc}`)
}

export async function notifyConfirm(author, title, replyMsg) {
  const name = author === 'her' ? '她' : '他'
  const msg = replyMsg ? `\n留言：${replyMsg}` : ''
  return await sendNotify(author, `💕 ${name}接单了你的心愿`, `心愿：${title}${msg}`)
}

export async function notifyReject(author, title, reason) {
  const name = author === 'her' ? '她' : '他'
  return await sendNotify(author, `🍂 ${name}婉拒了你的心愿`, `心愿：${title}\n原因：${reason || '暂无'}`)
}

export async function notifyComplete(author, title, doneMsg) {
  const name = author === 'her' ? '她' : '他'
  const msg = doneMsg ? `\n感言：${doneMsg}` : ''
  return await sendNotify(author, `🎉 ${name}兑现了你的心愿！`, `心愿：${title}${msg}`)
}

const levelEmojis = ['💭', '💭', '💕', '💕', '💕', '💗', '💗', '💗', '❤️‍🔥', '❤️‍🔥', '❤️‍🔥']

export async function notifyMiss(author, level, message) {
  const name = author === 'her' ? '她' : '他'
  const emoji = levelEmojis[level] || '💕'
  const desc = message ? `\n\n${message}` : ''
  return await sendNotify(author, `${emoji} ${name}说：我想你了（思念 ${level}/10）`, `此刻的心情${desc}`)
}
