import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../../common/appRoutes'
import { useFormatters } from '../../../common/hooks/useFormatters'
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notificationsApi'
import type { NotificationItem } from '../types'

const PREVIEW_COUNT = 8

export default function NotificationDropdown() {
  const navigate = useNavigate()
  const { formatDateTime } = useFormatters()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const load = useCallback(() => {
    getMyNotifications().then(setNotifications).catch(() => undefined)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const unreadCount = notifications.filter(n => !n.read).length

  function handleNotificationClick(n: NotificationItem) {
    if (!n.read) {
      markNotificationRead(n.id).catch(() => undefined)
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
    }
    if (n.jobId) navigate(AppRoutes.jobDetail(n.jobId))
    setOpen(false)
  }

  function handleMarkAllRead() {
    markAllNotificationsRead().catch(() => undefined)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          color: 'rgba(243,243,243,0.7)',
        }}
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -2,
            right: -2,
            backgroundColor: '#c0392b',
            color: 'white',
            borderRadius: '50%',
            width: 16,
            height: 16,
            fontSize: '0.6rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 0.5rem)',
          width: 340,
          backgroundColor: 'white',
          border: '1px solid rgba(28,27,27,0.1)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(28,27,27,0.12)',
          zIndex: 1000,
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            borderBottom: '1px solid rgba(28,27,27,0.07)',
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--c-dark)' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'rgba(28,27,27,0.4)', marginLeft: '0.4rem' }}>
                  {unreadCount} unread
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  color: 'var(--c-mid)',
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(28,27,27,0.35)', fontSize: '0.875rem' }}>
              No notifications yet
            </div>
          ) : (
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {notifications.slice(0, PREVIEW_COUNT).map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid rgba(28,27,27,0.05)',
                    cursor: n.jobId ? 'pointer' : 'default',
                    backgroundColor: n.read ? 'white' : 'rgba(71,69,69,0.04)',
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'flex-start',
                  }}
                >
                  {!n.read && (
                    <span style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: 'var(--c-dark)',
                      flexShrink: 0,
                      marginTop: 5,
                    }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0, paddingLeft: n.read ? '13px' : 0 }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--c-dark)', lineHeight: 1.4, marginBottom: '0.2rem' }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(28,27,27,0.38)' }}>
                      {formatDateTime(n.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            onClick={() => { navigate(AppRoutes.NOTIFICATIONS); setOpen(false) }}
            style={{
              padding: '0.75rem 1rem',
              textAlign: 'center',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--c-mid)',
              cursor: 'pointer',
              borderTop: '1px solid rgba(28,27,27,0.07)',
            }}
          >
            View all notifications →
          </div>
        </div>
      )}
    </div>
  )
}
