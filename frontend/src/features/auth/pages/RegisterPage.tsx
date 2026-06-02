import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { AppRoutes } from '../../../common/appRoutes'
import { useToast } from '../../../common/context/ToastContext'
import { register } from '../api/authApi'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { showError } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      navigate(AppRoutes.SELECT_ROLE)
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card-fleet">
        <h2 style={{ color: 'var(--c-light)', fontWeight: 700, marginBottom: '0.25rem' }}>
          Create an account
        </h2>
        <p style={{ color: 'rgba(243,243,243,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Get started with ShipBidder
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Full name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              autoFocus
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
          </div>
          <button type="submit" className="btn-fleet" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="divider">or</div>

        <button
          className="btn-fleet-outline"
          onClick={() => { window.location.href = '/oauth2/authorization/google' }}
        >
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(243,243,243,0.5)', marginTop: '1.25rem', marginBottom: 0 }}>
          Already have an account? <Link to={AppRoutes.LOGIN}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
