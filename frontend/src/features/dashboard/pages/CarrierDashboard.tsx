import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserProfile } from '../../user/api/userApi'
import { AppRoutes } from '../../../common/appRoutes'
import { useToast } from '../../../common/context/ToastContext'
import AppNav from '../../../common/components/AppNav'
import { getOpenJobs } from '../../jobs/api/jobsApi'
import JobCard from '../../jobs/components/JobCard'
import type { JobResponse } from '../../jobs/types'

interface Props {
  user: UserProfile
}

const STATS = [
  { label: 'Active Bids', value: '0' },
  { label: 'Jobs Won',    value: '0' },
  { label: 'Completed',  value: '0' },
]

const PREVIEW_COUNT = 3

export default function CarrierDashboard({ user }: Props) {
  const navigate = useNavigate()
  const { showError } = useToast()
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOpenJobs()
      .then(setJobs)
      .catch((e: unknown) => showError(e instanceof Error ? e.message : 'Failed to load jobs'))
      .finally(() => setLoading(false))
  }, [showError])

  const preview = jobs.slice(0, PREVIEW_COUNT)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-light)' }}>
      <AppNav userName={user.name} showSignOut />

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
              {!loading && jobs.length > 0 && (
                <span style={{ fontWeight: 400, fontSize: '0.85rem', color: 'rgba(28,27,27,0.4)', marginLeft: '0.6rem' }}>
                  {jobs.length} open
                </span>
              )}
            </h2>
            <button
              className="btn-fleet"
              style={{ width: 'auto', padding: '0.4rem 1.1rem', fontSize: '0.875rem' }}
              onClick={() => navigate(AppRoutes.JOBS)}
            >
              Browse All
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'rgba(28,27,27,0.3)', fontSize: '0.95rem' }}>
              Loading...
            </div>
          )}

          {!loading && jobs.length === 0 && (
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
          )}

          {!loading && preview.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}>
              {preview.map(job => (
                <JobCard key={job.id} job={job} variant="carrier" onClick={() => navigate(AppRoutes.jobDetail(job.id))} />
              ))}
            </div>
          )}

          {!loading && jobs.length > PREVIEW_COUNT && (
            <button
              onClick={() => navigate(AppRoutes.JOBS)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--c-mid)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                padding: '0.75rem 0 0',
              }}
            >
              View all {jobs.length} jobs →
            </button>
          )}
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
