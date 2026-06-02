import { useFormatters } from '../../../common/hooks/useFormatters'
import type { BidResponse } from '../types'

interface Props {
  bids: BidResponse[]
  loading: boolean
  budgetCeiling: number
}

export default function BidList({ bids, loading, budgetCeiling }: Props) {
  const { formatCurrency, formatDateTime } = useFormatters()
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(28,27,27,0.35)', fontSize: '0.875rem' }}>
        Loading bids...
      </div>
    )
  }

  if (bids.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'rgba(28,27,27,0.03)',
        borderRadius: 8,
        color: 'rgba(28,27,27,0.35)',
        fontSize: '0.875rem',
      }}>
        No bids yet. The auction is open.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {bids.map((bid, i) => {
        const isLowest = i === 0
        const savings = budgetCeiling - bid.amount
        return (
          <div
            key={bid.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              backgroundColor: isLowest ? 'var(--c-dark)' : 'white',
              border: `1px solid ${isLowest ? 'var(--c-dark)' : 'rgba(28,27,27,0.08)'}`,
              borderRadius: 8,
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <span style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: isLowest ? 'var(--c-light)' : 'rgba(28,27,27,0.08)',
                color: isLowest ? 'var(--c-dark)' : 'var(--c-mid)',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                #{i + 1}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: isLowest ? 'var(--c-light)' : 'var(--c-dark)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {bid.bidderName}
                </div>
                <div style={{ fontSize: '0.75rem', color: isLowest ? 'rgba(243,243,243,0.55)' : 'rgba(28,27,27,0.4)' }}>
                  {formatDateTime(bid.createdAt)}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: isLowest ? 'var(--c-light)' : 'var(--c-dark)' }}>
                {formatCurrency(bid.amount)}
              </div>
              {isLowest && savings > 0 && (
                <div style={{ fontSize: '0.72rem', color: 'rgba(243,243,243,0.6)' }}>
                  saves {formatCurrency(savings)}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
