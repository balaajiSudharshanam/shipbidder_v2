import { useEffect, useRef } from 'react'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import type { LocationResponse } from '../../locations/types'

interface Props {
  pickup: LocationResponse
  dropoff: LocationResponse
}

export default function RouteMap({ pickup, dropoff }: Props) {
  const mapsReady = useGoogleMaps()
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (!mapsReady || !containerRef.current) return

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(containerRef.current, {
        zoom: 10,
        center: { lat: pickup.lat, lng: pickup.lng },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })
    }

    if (!rendererRef.current) {
      rendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: { strokeColor: '#1c1b1b', strokeWeight: 4 },
      })
      rendererRef.current.setMap(mapRef.current)
    }

    const service = new google.maps.DirectionsService()
    service.route(
      {
        origin: { lat: pickup.lat, lng: pickup.lng },
        destination: { lat: dropoff.lat, lng: dropoff.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          rendererRef.current?.setDirections(result)
        }
      },
    )
  }, [mapsReady, pickup, dropoff])

  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(28,27,27,0.08)' }}>
      {!mapsReady && (
        <div style={{
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(28,27,27,0.04)',
          color: 'rgba(28,27,27,0.3)',
          fontSize: '0.875rem',
        }}>
          Loading map...
        </div>
      )}
      <div ref={containerRef} style={{ height: 280, display: mapsReady ? 'block' : 'none' }} />
    </div>
  )
}
