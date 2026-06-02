interface Props {
  budgetCeiling: string
  auctionClosesAt: string
  onBudgetChange: (v: string) => void
  onAuctionChange: (v: string) => void
  onSubmit: () => void
  onBack: () => void
  submitting: boolean
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  border: '1px solid rgba(28,27,27,0.2)',
  borderRadius: 6,
  fontSize: '0.9rem',
  color: 'var(--c-dark)',
  backgroundColor: 'white',
  boxSizing: 'border-box',
}

export default function TermsStep({ budgetCeiling, auctionClosesAt, onBudgetChange, onAuctionChange, onSubmit, onBack, submitting }: Props) {
  const minDateTime = new Date()
  minDateTime.setMinutes(minDateTime.getMinutes() + 5)
  const minStr = minDateTime.toISOString().slice(0, 16)

  const canSubmit = Number(budgetCeiling) > 0 && !!auctionClosesAt && !submitting

  return (
    <div>
      <h2 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.25rem', margin: '0 0 0.25rem' }}>
        Terms
      </h2>
      <p style={{ color: 'rgba(28,27,27,0.5)', fontSize: '0.875rem', margin: '0 0 1.75rem' }}>
        Set your budget ceiling and auction deadline.
      </p>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)', marginBottom: '0.4rem' }}>
          Budget Ceiling (USD) *
        </label>
        <input
          type="number"
          min={0.01}
          step={0.01}
          value={budgetCeiling}
          onChange={e => onBudgetChange(e.target.value)}
          placeholder="e.g. 1000"
          style={inputStyle}
        />
        <p style={{ fontSize: '0.8rem', color: 'rgba(28,27,27,0.45)', margin: '0.35rem 0 0' }}>
          Lowest bid at or below this amount wins the auction.
        </p>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)', marginBottom: '0.4rem' }}>
          Auction Closes At *
        </label>
        <input
          type="datetime-local"
          min={minStr}
          value={auctionClosesAt}
          onChange={e => onAuctionChange(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid rgba(28,27,27,0.2)', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-mid)' }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="btn-fleet"
          style={{ width: 'auto', padding: '0.6rem 1.75rem', opacity: canSubmit ? 1 : 0.5 }}
        >
          {submitting ? 'Posting...' : 'Post Job'}
        </button>
      </div>
    </div>
  )
}
