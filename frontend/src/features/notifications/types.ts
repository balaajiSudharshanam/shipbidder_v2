export type NotificationType = 'AUCTION_CLOSED' | 'BID_ACCEPTED' | 'BID_REJECTED' | 'JOB_EXPIRED'

export interface NotificationItem {
  id: number
  type: NotificationType
  message: string
  jobId: number | null
  read: boolean
  createdAt: string
}
