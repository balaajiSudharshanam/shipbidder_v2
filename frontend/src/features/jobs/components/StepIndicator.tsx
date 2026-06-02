interface Props {
  steps: string[]
  current: number
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem' }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: i <= current ? 'var(--c-dark)' : 'rgba(28,27,27,0.15)',
              color: i <= current ? 'var(--c-light)' : 'rgba(28,27,27,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.4rem',
            }}>
              {i + 1}
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: i === current ? 700 : 400,
              color: i === current ? 'var(--c-dark)' : 'rgba(28,27,27,0.4)',
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              height: 1,
              flex: 1,
              backgroundColor: i < current ? 'var(--c-dark)' : 'rgba(28,27,27,0.15)',
              margin: '0 0.5rem',
              marginBottom: '1.2rem',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}
