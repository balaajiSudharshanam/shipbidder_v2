import { useState, useEffect } from 'react'

type LoadState = 'idle' | 'loading' | 'ready'

let state: LoadState = 'idle'
const listeners = new Set<() => void>()

function load(apiKey: string) {
  if (state !== 'idle') return
  state = 'loading'
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geocoding`
  script.async = true
  script.onload = () => {
    state = 'ready'
    listeners.forEach(fn => fn())
    listeners.clear()
  }
  document.head.appendChild(script)
}

export function useGoogleMaps(): boolean {
  const [ready, setReady] = useState(state === 'ready')

  useEffect(() => {
    if (state === 'ready') {
      setReady(true)
      return
    }
    const handler = () => setReady(true)
    listeners.add(handler)
    load(import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string)
    return () => { listeners.delete(handler) }
  }, [])

  return ready
}

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (typeof google === 'undefined') return null
  const geocoder = new google.maps.Geocoder()
  try {
    const result = await geocoder.geocode({ address })
    if (!result.results.length) return null
    const loc = result.results[0].geometry.location
    return { lat: loc.lat(), lng: loc.lng() }
  } catch {
    return null
  }
}
