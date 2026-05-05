import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Role } from '../../user/api/userApi'
import { AppRoutes } from '../../../common/appRoutes'
import { updateRole } from '../../user/api/userApi'

interface RoleCard {
  role: Role
  title: string
  subtitle: string
  description: string
}

const ROLES: RoleCard[] = [
  {
    role: 'JOB_POSTER',
    title: 'Job Poster',
    subtitle: 'Post shipping jobs',
    description: 'Post freight jobs, receive competitive bids from verified carriers, and manage your shipments end-to-end.',
  },
  {
    role: 'BIDDER',
    title: 'Carrier',
    subtitle: 'Bid on jobs',
    description: 'Browse available freight jobs, place bids, optimise your routes, and grow your trucking business.',
  },
]

export default function SelectRolePage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Role | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!selected) return
    setError('')
    setLoading(true)
    try {
      await updateRole(selected)
      navigate(AppRoutes.DASHBOARD)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to set role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 680 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            How will you use ShipBidder?
          </h2>
          <p style={{ color: 'rgba(28,27,27,0.5)', fontSize: '0.95rem', margin: 0 }}>
            Choose your role — you can only select this once.
          </p>
        </div>

        {error && <div className="alert-fleet" style={{ textAlign: 'center' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {ROLES.map(({ role, title, subtitle, description }) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              style={{
                background: selected === role ? 'var(--c-mid)' : 'rgba(71,69,69,0.08)',
                border: selected === role ? '2px solid var(--c-dark)' : '2px solid rgba(28,27,27,0.12)',
                borderRadius: 12,
                padding: '1.75rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <div style={{ color: selected === role ? 'var(--c-light)' : 'var(--c-dark)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{title}</div>
              <div style={{ color: selected === role ? 'rgba(243,243,243,0.6)' : 'rgba(28,27,27,0.45)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{subtitle}</div>
              <div style={{ color: selected === role ? 'rgba(243,243,243,0.75)' : 'rgba(28,27,27,0.6)', fontSize: '0.9rem', lineHeight: 1.5 }}>{description}</div>
              {selected === role && (
                <div style={{ marginTop: '1rem', color: 'var(--c-light)', fontSize: '0.85rem', fontWeight: 600 }}>✓ Selected</div>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn-fleet"
            onClick={handleConfirm}
            disabled={!selected || loading}
            style={{ maxWidth: 240 }}
          >
            {loading ? 'Saving…' : 'Confirm role'}
          </button>
        </div>
      </div>
    </div>
  )
}
