import { useState, useEffect } from 'react'
import { useGoogleMaps, geocodeAddress } from '../hooks/useGoogleMaps'
import { getLocations, saveLocation } from '../../locations/api/locationsApi'
import type { LocationResponse } from '../../locations/types'

interface Props {
  pickupId: number | null
  dropoffId: number | null
  onChange: (field: 'pickupId' | 'dropoffId', value: number | null) => void
  onNext: () => void
}

interface PickerState {
  mode: 'select' | 'new'
  address: string
  resolved: { lat: number; lng: number; address: string } | null
  saving: boolean
  error: string | null
}

const DEFAULT_PICKER: PickerState = {
  mode: 'select',
  address: '',
  resolved: null,
  saving: false,
  error: null,
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

export default function RouteStep({ pickupId, dropoffId, onChange, onNext }: Props) {
  const mapsReady = useGoogleMaps()
  const [locations, setLocations] = useState<LocationResponse[]>([])
  const [pickup, setPickup] = useState<PickerState>(DEFAULT_PICKER)
  const [dropoff, setDropoff] = useState<PickerState>(DEFAULT_PICKER)

  useEffect(() => {
    getLocations().then(setLocations).catch(() => {})
  }, [])

  function patch(which: 'pickup' | 'dropoff', update: Partial<PickerState>) {
    if (which === 'pickup') setPickup(p => ({ ...p, ...update }))
    else setDropoff(p => ({ ...p, ...update }))
  }

  async function handleFind(which: 'pickup' | 'dropoff') {
    const state = which === 'pickup' ? pickup : dropoff
    if (!state.address.trim()) return
    patch(which, { error: null })
    const coords = await geocodeAddress(state.address.trim())
    if (!coords) {
      patch(which, { error: 'Address not found. Try a more specific address.' })
      return
    }
    patch(which, { resolved: { ...coords, address: state.address.trim() } })
  }

  async function handleSave(which: 'pickup' | 'dropoff') {
    const state = which === 'pickup' ? pickup : dropoff
    if (!state.resolved) return
    patch(which, { saving: true, error: null })
    try {
      const saved = await saveLocation(state.resolved)
      setLocations(prev => [...prev, saved])
      onChange(which === 'pickup' ? 'pickupId' : 'dropoffId', saved.id)
      patch(which, { ...DEFAULT_PICKER })
    } catch {
      patch(which, { saving: false, error: 'Failed to save location.' })
    }
  }

  const canProceed = pickupId !== null && dropoffId !== null

  return (
    <div>
      <h2 style={{ color: 'var(--c-dark)', fontWeight: 700, fontSize: '1.25rem', margin: '0 0 0.25rem' }}>
        Route
      </h2>
      <p style={{ color: 'rgba(28,27,27,0.5)', fontSize: '0.875rem', margin: '0 0 1.75rem' }}>
        Choose pickup and dropoff locations.
      </p>

      {(['pickup', 'dropoff'] as const).map(which => {
        const state = which === 'pickup' ? pickup : dropoff
        const selectedId = which === 'pickup' ? pickupId : dropoffId
        const field = (which === 'pickup' ? 'pickupId' : 'dropoffId') as 'pickupId' | 'dropoffId'

        return (
          <div key={which} style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-dark)', marginBottom: '0.4rem' }}>
              {which === 'pickup' ? 'Pickup' : 'Dropoff'} Location
            </label>

            {state.mode === 'select' && (
              <>
                <select
                  value={selectedId ?? ''}
                  onChange={e => onChange(field, e.target.value === '' ? null : Number(e.target.value))}
                  style={inputStyle}
                >
                  <option value="">Select a saved location...</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.address ?? `${loc.lat.toFixed(4)}°, ${loc.lng.toFixed(4)}°`}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => patch(which, { mode: 'new' })}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-mid)', cursor: 'pointer', fontSize: '0.85rem', padding: '0.35rem 0', marginTop: '0.4rem', fontWeight: 600 }}
                >
                  + Add new location
                </button>
              </>
            )}

            {state.mode === 'new' && (
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    value={state.address}
                    onChange={e => patch(which, { address: e.target.value, resolved: null })}
                    onKeyDown={e => { if (e.key === 'Enter') void handleFind(which) }}
                    placeholder="Enter address..."
                    style={{ ...inputStyle, flex: 1 }}
                    disabled={!mapsReady}
                  />
                  <button
                    type="button"
                    onClick={() => void handleFind(which)}
                    disabled={!mapsReady || !state.address.trim()}
                    style={{ padding: '0.55rem 1rem', backgroundColor: 'var(--c-mid)', color: 'var(--c-light)', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', opacity: (!mapsReady || !state.address.trim()) ? 0.5 : 1 }}
                  >
                    {mapsReady ? 'Find' : 'Loading...'}
                  </button>
                </div>

                {state.error && (
                  <p style={{ fontSize: '0.8rem', color: '#c0392b', margin: '0.25rem 0' }}>{state.error}</p>
                )}

                {state.resolved && (
                  <div style={{ backgroundColor: 'rgba(71,69,69,0.06)', borderRadius: 6, padding: '0.75rem', marginTop: '0.5rem' }}>
                    <p style={{ margin: '0 0 0.6rem', fontSize: '0.875rem', color: 'var(--c-dark)' }}>
                      {state.resolved.lat.toFixed(5)}°N, {state.resolved.lng.toFixed(5)}°E
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => void handleSave(which)}
                        disabled={state.saving}
                        style={{ padding: '0.4rem 0.9rem', backgroundColor: 'var(--c-dark)', color: 'var(--c-light)', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                      >
                        {state.saving ? 'Saving...' : 'Save this location'}
                      </button>
                      <button
                        type="button"
                        onClick={() => patch(which, { mode: 'select', address: '', resolved: null })}
                        style={{ padding: '0.4rem 0.9rem', backgroundColor: 'transparent', color: 'var(--c-mid)', border: '1px solid rgba(28,27,27,0.2)', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

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
  )
}
