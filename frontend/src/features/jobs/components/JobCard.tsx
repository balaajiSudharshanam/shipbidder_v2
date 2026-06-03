import { useFormatters } from '../../../common/hooks/useFormatters'
import type { JobResponse } from '../types'

interface Props {
  job: JobResponse
  variant: 'poster' | 'carrier'
  hasPlacedBid?: boolean
  onClick?: () => void
}

const STATUS_STYLE: Record<string, { backgroundColor: string; color: string }> = {
  OPEN:       { backgroundColor: 'var(--c-dark)', color: 'var(--c-light)' },
  AWARDED:    { backgroundColor: 'var(--c-mid)',  color: 'var(--c-light)' },
  IN_TRANSIT: { backgroundColor: 'var(--c-mid)',  color: 'var(--c-light)' },
  COMPLETED:  { backgroundColor: 'rgba(28,27,27,0.1)', color: 'var(--c-dark)' },
  CANCELLED:  { backgroundColor: 'rgba(28,27,27,0.08)', color: 'var(--c-mid)' },
}

const badgeBase: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  padding: '0.2rem 0.55rem',
  borderRadius: 4,
}

export default function JobCard({ job, variant, hasPlacedBid = false, onClick }: Props) {
  const { formatCurrency, formatDate, formatLocation } = useFormatters()
  const statusStyle = STATUS_STYLE[job.status] ?? STATUS_STYLE.OPEN
  const dims =
    job.shipment.lengthCm && job.shipment.widthCm && job.shipment.heightCm
      ? ` · ${job.shipment.lengthCm}×${job.shipment.widthCm}×${job.shipment.heightCm} cm`
      : ''

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        border: '1px solid rgba(28,27,27,0.08)',
        borderRadius: 10,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <span style={{ ...badgeBase, ...statusStyle }}>{job.status}</span>
          <span style={{ ...badgeBase, backgroundColor: 'rgba(71,69,69,0.08)', color: 'var(--c-mid)' }}>
            {job.shipment.cargoType}
          </span>
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--c-dark)' }}>
          {formatCurrency(job.budgetCeiling)}
        </span>
      </div>

      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--c-dark)', marginBottom: '0.2rem' }}>
          {formatLocation(job.pickup)}
          <span style={{ fontWeight: 400, color: 'var(--c-mid)', margin: '0 0.4rem' }}>→</span>
          {formatLocation(job.dropoff)}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(28,27,27,0.45)' }}>
          {job.shipment.weightKg} kg{dims}{job.shipment.fragile ? ' · Fragile' : ''}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.78rem', color: 'rgba(28,27,27,0.38)' }}>
          Closes {formatDate(job.auctionClosesAt)}
        </span>
        {variant === 'carrier' && job.status === 'OPEN' && (
          <button
            className="btn-fleet"
            disabled={hasPlacedBid}
            onClick={e => { e.stopPropagation(); onClick?.() }}
            style={{ width: 'auto', padding: '0.35rem 0.9rem', fontSize: '0.8rem', opacity: hasPlacedBid ? 0.45 : 1, cursor: hasPlacedBid ? 'default' : 'pointer' }}
          >
            {hasPlacedBid ? 'Bid Placed' : 'Place Bid'}
          </button>
        )}
      </div>
    </div>
  )
}
