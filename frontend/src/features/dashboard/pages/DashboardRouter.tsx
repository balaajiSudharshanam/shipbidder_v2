import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserProfile } from '../../user/api/userApi'
import { AppRoutes } from '../../../common/appRoutes'
import { getMe } from '../../user/api/userApi'
import JobPosterDashboard from './JobPosterDashboard'
import CarrierDashboard from './CarrierDashboard'

export default function DashboardRouter() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => navigate(AppRoutes.LOGIN, { replace: true }))
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--c-mid)', fontSize: '0.95rem' }}>Loading…</span>
      </div>
    )
  }

  if (!user) return null

  return user.role === 'JOB_POSTER'
    ? <JobPosterDashboard user={user} />
    : <CarrierDashboard user={user} />
}
