import { differenceInMinutes, differenceInSeconds, format } from 'date-fns'
import { Message } from '../types/chat.type'

export function groupMessagesByTime(messages: Message[], thresholdMinutes = 5) {
  const result: Array<{ type: 'timestamp'; time: string } | { type: 'message'; message: Message }> = []

  let lastTimestamp: Date = new Date(messages[1]?.createdAt ?? 0)

  for (const msg of messages) {
    const currentTime = new Date(msg.createdAt as string)
    result.push({ type: 'message', message: msg })
    if (!lastTimestamp || differenceInMinutes(currentTime, lastTimestamp) > thresholdMinutes) {
      result.push({
        type: 'timestamp',
        time: format(currentTime, 'HH:mm dd/MM/yyyy')
      })
    }

    lastTimestamp = currentTime
  }

  return result
}

export function formatInstagramTime(dateString: string) {
  // Lấy khoảng cách dạng "1 day", "2 weeks", "3 hours"...

  const created = new Date(dateString)
  const now = new Date()

  const diff = differenceInSeconds(now, created)

  if (diff < 60) return `${diff} giây`
  if (diff < 3600) return `${Math.floor(diff / 60)} phút`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày`
  return `${Math.floor(diff / 604800)} tuần`
}
