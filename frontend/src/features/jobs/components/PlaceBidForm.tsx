import { useState } from 'react'
import { useToast } from '../../../common/context/ToastContext'
import { useUser } from '../../user/context/UserContext'
import { placeBid } from '../api/bidsApi'

interface Props {
  jobId: number
  budgetCeiling: number
  jobStatus: string
  auctionClosesAt: string
  onBidPlaced: () => void
}

export default function PlaceBidForm({ jobId, budgetCeiling, jobStatus, auctionClosesAt, onBidPlaced }: Props) {
  const { showError } = useToast()
  const { user } = useUser()
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const isClosed = jobStatus !== 'OPEN' || new Date(auctionClosesAt) < new Date()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) {
      showError('Please enter a valid bid amount')
      return
    }
    if (!user) {
      showError('You must be logged in to place a bid')
      return
    }
    setSubmitting(true)
    try {
      await placeBid(user.id, jobId, parsed)
      setSuccess(true)
      setAmount('')
      onBidPlaced()
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to place bid')
    } finally {
      setSubmitting(false)
    }
  }

  if (isClosed) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'rgba(28,27,27,0.04)',
        borderRadius: 8,
        textAlign: 'center',
        color: 'rgba(28,27,27,0.4)',
        fontSize: '0.875rem',
      }}>
        Bidding is closed for this job.
      </div>
    )
  }

  if (success) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--c-dark)',
        borderRadius: 8,
        textAlign: 'center',
        color: 'var(--c-light)',
      }}>
        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Bid placed!</div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(243,243,243,0.6)' }}>
          Your bid has been submitted successfully.
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={e => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)', marginBottom: '0.4rem' }}>
          Your Bid (USD)
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(28,27,27,0.4)',
            fontWeight: 600,
            pointerEvents: 'none',
          }}>
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="0.01"
            max={budgetCeiling}
            step="0.01"
            placeholder="0.00"
            required
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 1.5rem',
              border: '1px solid rgba(28,27,27,0.2)',
              borderRadius: 6,
              fontSize: '1rem',
              color: 'var(--c-dark)',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'rgba(28,27,27,0.4)', margin: '0.35rem 0 0' }}>
          Budget ceiling: ${budgetCeiling.toLocaleString()} — lowest bid wins
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting || !amount}
        className="btn-fleet"
        style={{ width: 'auto', padding: '0.65rem 1.75rem', opacity: submitting || !amount ? 0.5 : 1 }}
      >
        {submitting ? 'Placing bid...' : 'Place Bid'}
      </button>
    </form>
  )
}
