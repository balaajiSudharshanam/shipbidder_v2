import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserProfile } from '../../user/api/userApi'
import { AppRoutes } from '../../../common/appRoutes'
import { useToast } from '../../../common/context/ToastContext'
import AppNav from '../../../common/components/AppNav'
import NotificationDropdown from '../../notifications/components/NotificationDropdown'
import { getMyJobs } from '../../jobs/api/jobsApi'
import JobCard from '../../jobs/components/JobCard'
import PostJobModal from '../../jobs/components/PostJobModal'
import type { JobResponse } from '../../jobs/types'

interface Props {
  user: UserProfile
}

export default function JobPosterDashboard({ user }: Props) {
  const navigate = useNavigate()
  const { showError } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [loading, setLoading] = useState(true)

  function loadJobs() {
    getMyJobs()
      .then(setJobs)
      .catch((e: unknown) => showError(e instanceof Error ? e.message : 'Failed to load jobs'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadJobs() }, [])

  const pendingAwardJobs = jobs.filter(j => j.status === 'PENDING_AWARD')
  const otherJobs = jobs.filter(j => j.status !== 'PENDING_AWARD')

  const stats = [
    { label: 'Jobs Posted',     value: jobs.length },
    { label: 'Active Auctions', value: jobs.filter(j => j.status === 'OPEN').length },
    { label: 'Awaiting Award',  value: pendingAwardJobs.length, highlight: pendingAwardJobs.length > 0 },
    { label: 'Completed',       value: jobs.filter(j => j.status === 'COMPLETED').length },
  ]

  const cardGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-light)' }}>
      <AppNav userName={user.name} showSignOut notificationsSlot={<NotificationDropdown />} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.75rem', margin: '0 0 0.25rem' }}>
            Welcome back, {user.name}
          </h1>
          <p style={{ color: 'rgba(28,27,27,0.45)', margin: 0, fontSize: '0.95rem' }}>
            Job Poster · {user.email}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {stats.map(({ label, value, highlight }) => (
            <div
              key={label}
              style={{
                backgroundColor: highlight ? 'rgba(180,120,0,0.85)' : 'var(--c-mid)',
                borderRadius: 10,
                padding: '1.5rem',
              }}
            >
              <div style={{ color: 'var(--c-light)', fontSize: '2.25rem', fontWeight: 700, lineHeight: 1 }}>
                {loading ? '—' : value}
              </div>
              <div style={{ color: 'rgba(243,243,243,0.55)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <button
            className="btn-fleet"
            style={{ width: 'auto', padding: '0.6rem 1.5rem' }}
            onClick={() => setModalOpen(true)}
          >
            + Post New Job
          </button>
        </div>

        {!loading && pendingAwardJobs.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(180,120,0,0.08)',
              border: '1px solid rgba(180,120,0,0.25)',
              borderRadius: 8,
              padding: '0.75rem 1.1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(140,90,0,0.9)' }}>
                Action required
              </span>
              <span style={{ fontSize: '0.875rem', color: 'rgba(140,90,0,0.7)' }}>
                — {pendingAwardJobs.length === 1
                  ? '1 auction has closed and is awaiting your selection.'
                  : `${pendingAwardJobs.length} auctions have closed and are awaiting your selection.`}
              </span>
            </div>
            <div style={cardGrid}>
              {pendingAwardJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  variant="poster"
                  onClick={() => navigate(AppRoutes.jobDetail(job.id))}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 1rem' }}>
            {pendingAwardJobs.length > 0 ? 'Other Jobs' : 'Recent Jobs'}
          </h2>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'rgba(28,27,27,0.3)', fontSize: '0.95rem' }}>
              Loading...
            </div>
          )}

          {!loading && otherJobs.length === 0 && pendingAwardJobs.length === 0 && (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid rgba(28,27,27,0.08)',
              borderRadius: 10,
              padding: '3rem',
              textAlign: 'center',
            }}>
              <p style={{ color: 'rgba(28,27,27,0.35)', margin: 0, fontSize: '0.95rem' }}>
                No jobs posted yet. Post your first job to receive bids from carriers.
              </p>
            </div>
          )}

          {!loading && otherJobs.length > 0 && (
            <div style={cardGrid}>
              {otherJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  variant="poster"
                  onClick={() => navigate(AppRoutes.jobDetail(job.id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <PostJobModal
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); loadJobs() }}
        />
      )}
    </div>
  )
}
