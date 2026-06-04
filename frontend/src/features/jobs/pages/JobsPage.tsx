import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../../common/appRoutes'
import { useUser } from '../../user/context/UserContext'
import AppNav from '../../../common/components/AppNav'
import NotificationDropdown from '../../notifications/components/NotificationDropdown'
import { getOpenJobs } from '../api/jobsApi'
import { getMyBids } from '../api/bidsApi'
import JobCard from '../components/JobCard'
import type { JobResponse, BidResponse } from '../types'

export default function JobsPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [bids, setBids] = useState<BidResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getOpenJobs()
      .then(setJobs)
      .catch(() => setError('Failed to load jobs. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (user?.role === 'BIDDER') {
      getMyBids().then(setBids).catch(() => undefined)
    }
  }, [user])

  const biddedJobIds = new Set(bids.map(b => b.jobId))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-light)' }}>
      <AppNav onBack={() => navigate(AppRoutes.DASHBOARD)} backLabel="← Dashboard" notificationsSlot={<NotificationDropdown />} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.75rem', margin: '0 0 0.25rem' }}>
            Available Jobs
          </h1>
          <p style={{ color: 'rgba(28,27,27,0.45)', margin: 0, fontSize: '0.95rem' }}>
            {loading ? 'Loading...' : `${jobs.length} open auction${jobs.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(192,57,43,0.07)',
            border: '1px solid rgba(192,57,43,0.18)',
            borderRadius: 8,
            padding: '0.9rem 1.1rem',
            color: '#c0392b',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(28,27,27,0.3)', fontSize: '0.95rem' }}>
            Loading jobs...
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid rgba(28,27,27,0.08)',
            borderRadius: 10,
            padding: '3.5rem',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(28,27,27,0.35)', margin: 0 }}>
              No open jobs available right now. Check back soon.
            </p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            {jobs.map(job => (
              <JobCard key={job.id} job={job} variant="carrier" hasPlacedBid={biddedJobIds.has(job.id)} onClick={() => navigate(AppRoutes.jobDetail(job.id))} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
