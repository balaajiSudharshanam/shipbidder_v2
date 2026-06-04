import { ApiRoutes } from '../../../common/apiRoutes'
import type { NotificationItem } from '../types'

export async function getMyNotifications(): Promise<NotificationItem[]> {
  const res = await fetch(ApiRoutes.Notification.BASE, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch notifications')
  return res.json() as Promise<NotificationItem[]>
}

export async function markNotificationRead(id: number): Promise<void> {
  await fetch(`${ApiRoutes.Notification.BASE}${ApiRoutes.Notification.BY_ID_READ(id)}`, {
    method: 'PATCH',
    credentials: 'include',
  })
}

export async function markAllNotificationsRead(): Promise<void> {
  await fetch(`${ApiRoutes.Notification.BASE}${ApiRoutes.Notification.READ_ALL}`, {
    method: 'POST',
    credentials: 'include',
  })
}
