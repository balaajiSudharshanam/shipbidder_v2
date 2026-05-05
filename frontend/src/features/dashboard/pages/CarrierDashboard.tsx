import type { UserProfile } from '../../user/api/userApi'
import { AppRoutes } from '../../../common/appRoutes'

interface Props {
  user: UserProfile
}

const STATS = [
  { label: 'Active Bids', value: '0' },
  { label: 'Jobs Won', value: '0' },
  { label: 'Completed', value: '0' },
]

function DashboardNav({ name }: { name: string }) {
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
      <span style={{ color: 'var(--c-light)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
        ShipBidder
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <span style={{ color: 'rgba(243,243,243,0.6)', fontSize: '0.875rem' }}>{name}</span>
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
      </div>
    </nav>
  )
}

export default function CarrierDashboard({ user }: Props) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-light)' }}>
      <DashboardNav name={user.name} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.75rem', margin: '0 0 0.25rem' }}>
            Welcome back, {user.name}
          </h1>
          <p style={{ color: 'rgba(28,27,27,0.45)', margin: 0, fontSize: '0.95rem' }}>
            Carrier · {user.email}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {STATS.map(({ label, value }) => (
            <div key={label} style={{ backgroundColor: 'var(--c-mid)', borderRadius: 10, padding: '1.5rem' }}>
              <div style={{ color: 'var(--c-light)', fontSize: '2.25rem', fontWeight: 700, lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ color: 'rgba(243,243,243,0.55)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
              Available Jobs
            </h2>
            <button className="btn-fleet" style={{ width: 'auto', padding: '0.4rem 1.1rem', fontSize: '0.875rem' }}>
              Browse All
            </button>
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid rgba(28,27,27,0.08)',
            borderRadius: 10,
            padding: '3rem',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(28,27,27,0.35)', margin: 0, fontSize: '0.95rem' }}>
              No jobs available right now. Check back soon for new freight opportunities.
            </p>
          </div>
        </div>

        <div>
          <h2 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 1rem' }}>
            My Bids
          </h2>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid rgba(28,27,27,0.08)',
            borderRadius: 10,
            padding: '3rem',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(28,27,27,0.35)', margin: 0, fontSize: '0.95rem' }}>
              No active bids. Browse available jobs to start bidding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
