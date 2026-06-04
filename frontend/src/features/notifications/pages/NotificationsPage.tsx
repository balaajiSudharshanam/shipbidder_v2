import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../../common/appRoutes'
import { useFormatters } from '../../../common/hooks/useFormatters'
import AppNav from '../../../common/components/AppNav'
import NotificationDropdown from '../components/NotificationDropdown'
import { getMyNotifications, markAllNotificationsRead } from '../api/notificationsApi'
import type { NotificationItem } from '../types'

const TYPE_LABEL: Record<string, string> = {
  AUCTION_CLOSED: 'Auction Closed',
  BID_ACCEPTED: 'Bid Accepted',
  BID_REJECTED: 'Bid Rejected',
  JOB_EXPIRED: 'Job Expired',
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { formatDateTime } = useFormatters()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyNotifications()
      .then(setNotifications)
      .catch(() => undefined)
      .finally(() => setLoading(false))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  function handleMarkAllRead() {
    markAllNotificationsRead().catch(() => undefined)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-light)' }}>
      <AppNav
        onBack={() => navigate(AppRoutes.DASHBOARD)}
        backLabel="← Dashboard"
        notificationsSlot={<NotificationDropdown />}
      />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.75rem', margin: '0 0 0.2rem' }}>
              Notifications
            </h1>
            {!loading && (
              <p style={{ color: 'rgba(28,27,27,0.45)', margin: 0, fontSize: '0.9rem' }}>
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-fleet"
              style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            >
              Mark all read
            </button>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(28,27,27,0.3)', fontSize: '0.95rem' }}>
            Loading...
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid rgba(28,27,27,0.08)',
            borderRadius: 10,
            padding: '3.5rem',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(28,27,27,0.35)', margin: 0 }}>No notifications yet.</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => n.jobId && navigate(AppRoutes.jobDetail(n.jobId))}
                style={{
                  backgroundColor: n.read ? 'white' : 'rgba(71,69,69,0.05)',
                  border: '1px solid rgba(28,27,27,0.08)',
                  borderRadius: 10,
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  cursor: n.jobId ? 'pointer' : 'default',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 4,
                      backgroundColor: 'rgba(28,27,27,0.07)',
                      color: 'var(--c-mid)',
                    }}>
                      {TYPE_LABEL[n.type] ?? n.type}
                    </span>
                    {!n.read && (
                      <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: 'var(--c-dark)',
                        display: 'inline-block',
                        flexShrink: 0,
                      }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--c-dark)', lineHeight: 1.5 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(28,27,27,0.38)', marginTop: '0.3rem' }}>
                    {formatDateTime(n.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
