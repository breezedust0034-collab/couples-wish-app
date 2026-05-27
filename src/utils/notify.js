const PUSH_KEY = 'PDU41661TYV0ZDt1g1DnAOflkr2Nv7SwIwMfnDHpq'
const PUSH_URL = 'https://api2.pushdeer.com/message/push'

const categoryNames = { eat: '🍜 吃什么', play: '🎮 玩什么', do: '🌸 做什么' }

export function sendNotify(title, content) {
  return fetch(PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pushkey: PUSH_KEY, text: title, desp: content }),
  }).catch(() => {})
}

export function notifyNewWish(author, title, category, note) {
  const name = author === 'her' ? '她' : '他'
  const cat = categoryNames[category] || ''
  const desc = note ? `\n悄悄话：${note}` : ''
  sendNotify(`🌸 ${name}向你许下了一个新心愿`, `${cat}\n${title}${desc}`)
}

export function notifyConfirm(author, title, replyMsg) {
  const name = author === 'her' ? '她' : '他'
  const msg = replyMsg ? `\n留言：${replyMsg}` : ''
  sendNotify(`💕 ${name}接单了你的心愿`, `心愿：${title}${msg}`)
}

export function notifyReject(author, title, reason) {
  const name = author === 'her' ? '她' : '他'
  sendNotify(`🍂 ${name}婉拒了你的心愿`, `心愿：${title}\n原因：${reason || '暂无'}`)
}

export function notifyComplete(author, title, doneMsg) {
  const name = author === 'her' ? '她' : '他'
  const msg = doneMsg ? `\n感言：${doneMsg}` : ''
  sendNotify(`🎉 ${name}兑现了你的心愿！`, `心愿：${title}${msg}`)
}
