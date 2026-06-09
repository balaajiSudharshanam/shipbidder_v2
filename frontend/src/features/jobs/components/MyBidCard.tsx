import { useFormatters } from '../../../common/hooks/useFormatters'
import type { BidResponse, BidStatus } from '../types'

interface Props {
  bid: BidResponse
}

const STATUS_LABEL: Record<BidStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Not selected',
}

const STATUS_STYLE: Record<BidStatus, React.CSSProperties> = {
  PENDING: { backgroundColor: 'rgba(71,69,69,0.08)', color: '#474545' },
  ACCEPTED: { backgroundColor: 'rgba(40,120,60,0.1)', color: '#1a6b35' },
  REJECTED: { backgroundColor: 'rgba(28,27,27,0.06)', color: 'rgba(28,27,27,0.4)' },
}

export default function MyBidCard({ bid }: Props) {
  const { formatCurrency, formatDateTime } = useFormatters()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-dark)' }}>
          {formatCurrency(bid.amount)}
        </span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          padding: '0.25rem 0.6rem',
          borderRadius: 4,
          ...STATUS_STYLE[bid.status],
        }}>
          {STATUS_LABEL[bid.status]}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(28,27,27,0.4)' }}>
        Placed {formatDateTime(bid.createdAt)}
      </p>
      {bid.status === 'PENDING' && (
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(28,27,27,0.5)' }}>
          Your bid is in — the auction is still open.
        </p>
      )}
      {bid.status === 'ACCEPTED' && (
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#1a6b35', fontWeight: 600 }}>
          You won this job. Await contact from the job poster.
        </p>
      )}
      {bid.status === 'REJECTED' && (
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(28,27,27,0.4)' }}>
          This job was awarded to another carrier.
        </p>
      )}
    </div>
  )
}
