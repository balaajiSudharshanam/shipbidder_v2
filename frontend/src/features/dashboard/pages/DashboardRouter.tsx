import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppRoutes } from '../../../common/appRoutes'
import { useUser } from '../../user/context/UserContext'

import CarrierDashboard from './CarrierDashboard'
import JobPosterDashboard from './JobPosterDashboard'

export default function DashboardRouter() {
  const navigate = useNavigate()
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading && !user) navigate(AppRoutes.LOGIN, { replace: true })
  }, [loading, user, navigate])

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
