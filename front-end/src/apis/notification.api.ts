import { Notification } from '../types/notification.type'
import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'

const API_URL = 'notifications'
export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data } = await http.get<SuccessResponse<Notification[]>>(`${API_URL}/`)
  return data.result
}
