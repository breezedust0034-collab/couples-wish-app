const PUSH_KEY = '59c6cadafffa41eab52a712beba3ef18'
const PUSH_API = 'https://api2.pushdeer.com/message/push'

export function sendNotification(title, text) {
  if (!PUSH_KEY) return

  fetch(PUSH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      pushkey: PUSH_KEY,
      title,
      text,
      type: 'markdown',
    }),
  }).catch(err => console.warn('推送通知失败:', err))
}
