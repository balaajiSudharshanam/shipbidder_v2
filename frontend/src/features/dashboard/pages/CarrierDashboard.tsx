import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserProfile } from '../../user/api/userApi'
import { AppRoutes } from '../../../common/appRoutes'
import { useToast } from '../../../common/context/ToastContext'
import { useFormatters } from '../../../common/hooks/useFormatters'
import AppNav from '../../../common/components/AppNav'
import NotificationDropdown from '../../notifications/components/NotificationDropdown'
import { getOpenJobs } from '../../jobs/api/jobsApi'
import { getMyBids } from '../../jobs/api/bidsApi'
import JobCard from '../../jobs/components/JobCard'
import type { JobResponse, BidResponse } from '../../jobs/types'

interface Props {
  user: UserProfile
}

const PREVIEW_COUNT = 3

const BID_STATUS_STYLE: Record<string, { backgroundColor: string; color: string }> = {
  PENDING:  { backgroundColor: 'rgba(71,69,69,0.08)', color: 'var(--c-mid)' },
  ACCEPTED: { backgroundColor: 'var(--c-dark)',        color: 'var(--c-light)' },
  REJECTED: { backgroundColor: 'rgba(28,27,27,0.06)', color: 'rgba(28,27,27,0.35)' },
}

export default function CarrierDashboard({ user }: Props) {
  const navigate = useNavigate()
  const { showError } = useToast()
  const { formatCurrency, formatDateTime } = useFormatters()
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [bids, setBids] = useState<BidResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [bidsLoading, setBidsLoading] = useState(true)

  useEffect(() => {
    getOpenJobs()
      .then(setJobs)
      .catch((e: unknown) => showError(e instanceof Error ? e.message : 'Failed to load jobs'))
      .finally(() => setLoading(false))
  }, [showError])

  useEffect(() => {
    getMyBids()
      .then(setBids)
      .catch((e: unknown) => showError(e instanceof Error ? e.message : 'Failed to load bids'))
      .finally(() => setBidsLoading(false))
  }, [showError])

  const activeBids = bids.filter(b => b.status === 'PENDING').length
  const wonBids    = bids.filter(b => b.status === 'ACCEPTED').length

  const biddedJobIds = new Set(bids.map(b => b.jobId))
  const preview = jobs.slice(0, PREVIEW_COUNT)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-light)' }}>
      <AppNav userName={user.name} showSignOut notificationsSlot={<NotificationDropdown />} />

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
          {[
            { label: 'Active Bids', value: bidsLoading ? '—' : activeBids },
            { label: 'Jobs Won',    value: bidsLoading ? '—' : wonBids },
            { label: 'Total Bids',  value: bidsLoading ? '—' : bids.length },
          ].map(({ label, value }) => (
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
                <JobCard key={job.id} job={job} variant="carrier" hasPlacedBid={biddedJobIds.has(job.id)} onClick={() => navigate(AppRoutes.jobDetail(job.id))} />
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

          {bidsLoading && (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'rgba(28,27,27,0.3)', fontSize: '0.95rem' }}>
              Loading...
            </div>
          )}

          {!bidsLoading && bids.length === 0 && (
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
          )}

          {!bidsLoading && bids.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {bids.map(bid => (
                <div
                  key={bid.id}
                  onClick={() => navigate(AppRoutes.jobDetail(bid.jobId))}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid rgba(28,27,27,0.08)',
                    borderRadius: 10,
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)', marginBottom: '0.2rem' }}>
                      Job #{bid.jobId}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(28,27,27,0.4)' }}>
                      {formatDateTime(bid.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--c-dark)' }}>
                      {formatCurrency(bid.amount)}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 4,
                      ...(BID_STATUS_STYLE[bid.status] ?? BID_STATUS_STYLE.PENDING),
                    }}>
                      {bid.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
