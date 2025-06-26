import { differenceInMinutes, format } from 'date-fns'
import { Message } from '../types/chat.type'

export function groupMessagesByTime(messages: Message[], thresholdMinutes = 5) {
  const result: Array<{ type: 'timestamp'; time: string } | { type: 'message'; message: Message }> = []

  let lastTimestamp: Date | null = null

  for (const msg of messages) {
    const currentTime = new Date(msg.createdAt as string)
    result.push({ type: 'message', message: msg })
    if (!lastTimestamp || differenceInMinutes(lastTimestamp, currentTime) > thresholdMinutes) {
      result.push({
        type: 'timestamp',
        time: format(currentTime, 'HH:mm dd/MM/yyyy')
      })
    }

    lastTimestamp = currentTime
  }

  return result
}
