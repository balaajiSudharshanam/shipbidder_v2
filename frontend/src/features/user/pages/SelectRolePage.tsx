import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateRole, Role } from '../../user/api/userApi'

interface RoleCard {
  role: Role
  title: string
  subtitle: string
  description: string
  icon: string
}

const ROLES: RoleCard[] = [
  {
    role: 'JOB_POSTER',
    title: 'Job Poster',
    subtitle: 'Post shipping jobs',
    description:
      'Post freight jobs, receive competitive bids from verified carriers, and manage your shipments end-to-end.',
    icon: '📦',
  },
  {
    role: 'BIDDER',
    title: 'Carrier',
    subtitle: 'Bid on jobs',
    description:
      'Browse available freight jobs, place bids, optimise your routes, and grow your trucking business.',
    icon: '🚚',
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
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to set role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div style={{ width: '100%', maxWidth: 700 }} className="px-3">
        <div className="text-center mb-5">
          <h3 className="fw-bold">How will you use ShipBidder?</h3>
          <p className="text-muted">Choose your role — you can only select this once.</p>
        </div>

        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

        <div className="row g-4 mb-4">
          {ROLES.map(({ role, title, subtitle, description, icon }) => (
            <div className="col-md-6" key={role}>
              <div
                className={`card h-100 cursor-pointer border-2 ${
                  selected === role ? 'border-primary' : 'border-light'
                }`}
                style={{ cursor: 'pointer', transition: 'border-color 0.15s' }}
                onClick={() => setSelected(role)}
              >
                <div className="card-body p-4">
                  <div className="mb-3" style={{ fontSize: '2.5rem' }}>{icon}</div>
                  <h5 className="fw-bold mb-1">{title}</h5>
                  <p className="text-primary small fw-semibold mb-2">{subtitle}</p>
                  <p className="text-muted small mb-0">{description}</p>
                </div>
                {selected === role && (
                  <div className="card-footer bg-primary bg-opacity-10 border-0 text-center py-2">
                    <span className="text-primary small fw-semibold">✓ Selected</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            className="btn btn-primary px-5"
            onClick={handleConfirm}
            disabled={!selected || loading}
          >
            {loading ? 'Saving…' : 'Confirm role'}
          </button>
        </div>
      </div>
    </div>
  )
}
