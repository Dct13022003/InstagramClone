import { differenceInMinutes, format } from 'date-fns'
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
