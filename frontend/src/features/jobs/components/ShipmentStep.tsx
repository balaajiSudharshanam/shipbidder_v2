import { useRef, useEffect } from 'react'
import type { ShipmentPayload, CargoType } from '../types'

interface Props {
  value: Partial<ShipmentPayload>
  onChange: (patch: Partial<ShipmentPayload>) => void
  images: File[]
  onImagesChange: (images: File[]) => void
  onNext: () => void
  onBack: () => void
}

const MAX_IMAGES = 4

const CARGO_TYPES: { value: CargoType; label: string }[] = [
  { value: 'GENERAL',      label: 'General' },
  { value: 'REFRIGERATED', label: 'Refrigerated' },
  { value: 'HAZMAT',       label: 'Hazmat' },
  { value: 'OVERSIZED',    label: 'Oversized' },
]

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

export default function ShipmentStep({ value, onChange, images, onImagesChange, onNext, onBack }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrls = useRef<string[]>([])

  useEffect(() => {
    previewUrls.current = images.map(f => URL.createObjectURL(f))
    return () => { previewUrls.current.forEach(u => URL.revokeObjectURL(u)) }
  }, [images])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    const merged = [...images, ...selected].slice(0, MAX_IMAGES)
    onImagesChange(merged)
    e.target.value = ''
  }

  function removeImage(index: number) {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const canProceed = (value.weightKg ?? 0) > 0 && !!value.cargoType

  return (
    <div>
      <h2 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.25rem', margin: '0 0 0.25rem' }}>
        Shipment Details
      </h2>
      <p style={{ color: 'rgba(28,27,27,0.5)', fontSize: '0.875rem', margin: '0 0 1.75rem' }}>
        Describe what you are shipping.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)', marginBottom: '0.4rem' }}>
            Weight (kg) *
          </label>
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={value.weightKg ?? ''}
            onChange={e => onChange({ weightKg: e.target.valueAsNumber })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)', marginBottom: '0.4rem' }}>
            Cargo Type *
          </label>
          <select
            value={value.cargoType ?? ''}
            onChange={e => onChange({ cargoType: e.target.value as CargoType })}
            style={inputStyle}
          >
            <option value="">Select...</option>
            {CARGO_TYPES.map(ct => (
              <option key={ct.value} value={ct.value}>{ct.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {(['lengthCm', 'widthCm', 'heightCm'] as const).map(dim => (
          <div key={dim}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)', marginBottom: '0.4rem' }}>
              {dim === 'lengthCm' ? 'Length (cm)' : dim === 'widthCm' ? 'Width (cm)' : 'Height (cm)'}
            </label>
            <input
              type="number"
              min={0}
              value={value[dim] ?? ''}
              onChange={e => onChange({ [dim]: e.target.value ? e.target.valueAsNumber : undefined })}
              style={inputStyle}
            />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)', marginBottom: '0.4rem' }}>
          Special Instructions
        </label>
        <textarea
          value={value.specialInstructions ?? ''}
          onChange={e => onChange({ specialInstructions: e.target.value || undefined })}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {(['fragile', 'stackable'] as const).map(flag => (
          <label key={flag} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--c-dark)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={value[flag] ?? false}
              onChange={e => onChange({ [flag]: e.target.checked })}
            />
            {flag.charAt(0).toUpperCase() + flag.slice(1)}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)' }}>
            Photos <span style={{ fontWeight: 400, color: 'rgba(28,27,27,0.4)' }}>(optional, max {MAX_IMAGES})</span>
          </label>
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'transparent',
                border: '1px solid rgba(28,27,27,0.2)',
                borderRadius: 6,
                padding: '0.3rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--c-mid)',
                cursor: 'pointer',
              }}
            >
              + Add photo
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {images.length === 0 ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              padding: '1.5rem',
              border: '2px dashed rgba(28,27,27,0.15)',
              borderRadius: 8,
              background: 'transparent',
              cursor: 'pointer',
              color: 'rgba(28,27,27,0.35)',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            Click to add photos of your shipment
          </button>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {images.map((file, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(28,27,27,0.1)' }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(28,27,27,0.7)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid rgba(28,27,27,0.2)', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-mid)' }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="btn-fleet"
          style={{ width: 'auto', padding: '0.6rem 1.75rem', opacity: canProceed ? 1 : 0.5 }}
        >
          Next
        </button>
      </div>
    </div>
  )
}
