import type { ReactNode } from 'react'
import { AppRoutes } from '../appRoutes'

interface Props {
  onBack?: () => void
  backLabel?: string
  userName?: string
  showSignOut?: boolean
  notificationsSlot?: ReactNode
}

export default function AppNav({ onBack, backLabel = '← Back', userName, showSignOut, notificationsSlot }: Props) {
  function handleSignOut() {
    document.cookie = 'auth_token=; Max-Age=0; path=/'
    window.location.href = AppRoutes.LOGIN
  }

  return (
    <nav style={{
      backgroundColor: 'var(--c-dark)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(243,243,243,0.6)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              padding: 0,
              fontWeight: 600,
            }}
          >
            {backLabel}
          </button>
        )}
        <span style={{ color: 'var(--c-light)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
          ShipBidder
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {notificationsSlot}
        {userName && (
          <span style={{ color: 'rgba(243,243,243,0.6)', fontSize: '0.875rem' }}>{userName}</span>
        )}
        {showSignOut && (
          <button
            onClick={handleSignOut}
            style={{
              background: 'transparent',
              border: '1px solid rgba(243,243,243,0.25)',
              color: 'var(--c-light)',
              borderRadius: 6,
              padding: '0.35rem 0.9rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Sign out
          </button>
        )}
      </div>
    </nav>
  )
}
