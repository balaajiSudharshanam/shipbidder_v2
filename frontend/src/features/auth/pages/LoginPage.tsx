import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import type { LoginResponse } from '../api/authApi'
import { AppRoutes } from '../../../common/appRoutes'
import { login } from '../api/authApi'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res: LoginResponse = await login(email, password)
      navigate(res.status === 'ONBOARDING_REQUIRED' ? AppRoutes.SELECT_ROLE : AppRoutes.DASHBOARD)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card-fleet">
        <h2 style={{ color: 'var(--c-light)', fontWeight: 700, marginBottom: '0.25rem' }}>
          Welcome back
        </h2>
        <p style={{ color: 'rgba(243,243,243,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Sign in to your account
        </p>

        {error && <div className="alert-fleet">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-fleet" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
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
          Don't have an account? <Link to={AppRoutes.REGISTER}>Register</Link>
        </p>
      </div>
    </div>
  )
}
