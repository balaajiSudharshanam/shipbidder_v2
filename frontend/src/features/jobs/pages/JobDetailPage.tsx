import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFormatters } from '../../../common/hooks/useFormatters'
import { useToast } from '../../../common/context/ToastContext'
import { useUser } from '../../user/context/UserContext'
import AppNav from '../../../common/components/AppNav'
import NotificationDropdown from '../../notifications/components/NotificationDropdown'
import { getJobById, awardBid } from '../api/jobsApi'
import { getJobBids } from '../api/bidsApi'
import ImageCarousel from '../components/ImageCarousel'
import RouteMap from '../components/RouteMap'
import BidList from '../components/BidList'
import PlaceBidForm from '../components/PlaceBidForm'
import type { JobResponse, BidResponse } from '../types'

const STATUS_COLOR: Record<string, string> = {
  OPEN: 'var(--c-dark)',
  PENDING_AWARD: 'rgba(180,120,0,0.85)',
  AWARDED: 'var(--c-mid)',
  IN_TRANSIT: 'var(--c-mid)',
  COMPLETED: 'rgba(28,27,27,0.35)',
  CANCELLED: 'rgba(28,27,27,0.25)',
  EXPIRED: 'rgba(28,27,27,0.25)',
}

const badgeBase: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  padding: '0.2rem 0.55rem',
  borderRadius: 4,
  color: 'var(--c-light)',
}

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
      <span style={{ fontSize: '0.82rem', color: 'rgba(28,27,27,0.45)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--c-dark)', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showError, showSuccess } = useToast()
  const { user } = useUser()
  const { formatCurrency, formatDateTime, formatLocation } = useFormatters()

  const [job, setJob] = useState<JobResponse | null>(null)
  const [bids, setBids] = useState<BidResponse[]>([])
  const [jobLoading, setJobLoading] = useState(true)
  const [bidsLoading, setBidsLoading] = useState(false)
  const [awarding, setAwarding] = useState(false)

  const jobId = Number(id)
  const isPoster = !!user && !!job && user.email === job.posterEmail
  const isBidder = user?.role === 'BIDDER'
  const isPendingAward = job?.status === 'PENDING_AWARD'

  const fetchJob = useCallback(async () => {
    try {
      setJob(await getJobById(jobId))
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to load job')
    } finally {
      setJobLoading(false)
    }
  }, [jobId, showError])

  const fetchBids = useCallback(async () => {
    if (!isPoster && !isPendingAward) return
    setBidsLoading(true)
    try {
      setBids(await getJobBids(jobId))
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load bids')
    } finally {
      setBidsLoading(false)
    }
  }, [isPoster, isPendingAward, jobId, showError])

  useEffect(() => { void fetchJob() }, [fetchJob])
  useEffect(() => { void fetchBids() }, [fetchBids])

  async function handleAward(bidId: number) {
    setAwarding(true)
    try {
      await awardBid(jobId, bidId)
      showSuccess('Job awarded successfully!')
      await fetchJob()
      await fetchBids()
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to award bid')
    } finally {
      setAwarding(false)
    }
  }

  if (jobLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(28,27,27,0.3)', fontSize: '0.95rem' }}>Loading...</span>
      </div>
    )
  }

  if (!job) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(28,27,27,0.35)', fontSize: '0.95rem' }}>Job not found.</span>
      </div>
    )
  }

  const dims = job.shipment.lengthCm && job.shipment.widthCm && job.shipment.heightCm
    ? `${job.shipment.lengthCm} × ${job.shipment.widthCm} × ${job.shipment.heightCm} cm`
    : null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-light)' }}>
      <AppNav onBack={() => navigate(-1)} notificationsSlot={<NotificationDropdown />} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {isPoster && isPendingAward && (
          <div style={{
            backgroundColor: 'rgba(180,120,0,0.1)',
            border: '1px solid rgba(180,120,0,0.3)',
            borderRadius: 8,
            padding: '0.85rem 1.25rem',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            color: 'rgba(140,90,0,0.9)',
            fontWeight: 600,
          }}>
            Auction closed — review the bids below and select a winner.
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <span style={{ ...badgeBase, backgroundColor: STATUS_COLOR[job.status] ?? 'var(--c-mid)' }}>
            {job.status.replace('_', ' ')}
          </span>
          <span style={{ ...badgeBase, backgroundColor: 'rgba(71,69,69,0.1)', color: 'var(--c-mid)' }}>
            {job.shipment.cargoType}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'rgba(28,27,27,0.35)', marginLeft: 'auto' }}>
            Posted by {job.posterName}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 380px)',
          gap: '1.5rem',
          alignItems: 'start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <RouteMap pickup={job.pickup} dropoff={job.dropoff} />
            <ImageCarousel images={job.shipment.imageUrls} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              backgroundColor: 'white',
              border: '1px solid rgba(28,27,27,0.08)',
              borderRadius: 10,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--c-dark)' }}>Route</h2>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(28,27,27,0.4)', marginBottom: '0.15rem' }}>From</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--c-dark)' }}>{formatLocation(job.pickup)}</div>
              </div>
              <div style={{ borderLeft: '2px solid rgba(28,27,27,0.12)', marginLeft: '0.4rem', height: 12 }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(28,27,27,0.4)', marginBottom: '0.15rem' }}>To</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--c-dark)' }}>{formatLocation(job.dropoff)}</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              border: '1px solid rgba(28,27,27,0.08)',
              borderRadius: 10,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}>
              <h2 style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '1rem', color: 'var(--c-dark)' }}>Shipment</h2>
              <InfoRow label="Weight" value={`${job.shipment.weightKg} kg`} />
              {dims && <InfoRow label="Dimensions" value={dims} />}
              <InfoRow label="Fragile" value={job.shipment.fragile ? 'Yes' : 'No'} />
              <InfoRow label="Stackable" value={job.shipment.stackable ? 'Yes' : 'No'} />
              {job.shipment.specialInstructions && (
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(28,27,27,0.45)', marginBottom: '0.2rem' }}>Instructions</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--c-dark)' }}>{job.shipment.specialInstructions}</div>
                </div>
              )}
            </div>

            <div style={{
              backgroundColor: 'white',
              border: '1px solid rgba(28,27,27,0.08)',
              borderRadius: 10,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}>
              <h2 style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '1rem', color: 'var(--c-dark)' }}>Auction</h2>
              <InfoRow label="Budget ceiling" value={formatCurrency(job.budgetCeiling)} />
              <InfoRow label="Closes" value={formatDateTime(job.auctionClosesAt)} />
              {bids.length > 0 && isPoster && (
                <InfoRow label="Current lowest" value={formatCurrency(bids[0].amount)} />
              )}
            </div>

            {isPoster && (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid rgba(28,27,27,0.08)',
                borderRadius: 10,
                padding: '1.25rem',
              }}>
                <h2 style={{ margin: '0 0 1rem', fontWeight: 700, fontSize: '1rem', color: 'var(--c-dark)' }}>
                  Bids
                  {!bidsLoading && bids.length > 0 && (
                    <span style={{ fontWeight: 400, fontSize: '0.82rem', color: 'rgba(28,27,27,0.4)', marginLeft: '0.5rem' }}>
                      {bids.length} received
                    </span>
                  )}
                </h2>
                <BidList
                  bids={bids}
                  loading={bidsLoading || awarding}
                  budgetCeiling={job.budgetCeiling}
                  onAward={isPendingAward ? handleAward : undefined}
                />
              </div>
            )}

            {isBidder && (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid rgba(28,27,27,0.08)',
                borderRadius: 10,
                padding: '1.25rem',
              }}>
                <h2 style={{ margin: '0 0 1rem', fontWeight: 700, fontSize: '1rem', color: 'var(--c-dark)' }}>
                  Place a Bid
                </h2>
                <PlaceBidForm
                  jobId={job.id}
                  budgetCeiling={job.budgetCeiling}
                  jobStatus={job.status}
                  auctionClosesAt={job.auctionClosesAt}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
