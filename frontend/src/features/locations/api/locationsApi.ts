import { ApiRoutes } from '../../../common/apiRoutes'
import type { LocationResponse, SaveLocationPayload } from '../types'

export async function saveLocation(payload: SaveLocationPayload): Promise<LocationResponse> {
  const res = await fetch(ApiRoutes.Location.BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to save location')
  return res.json() as Promise<LocationResponse>
}

export async function getLocations(): Promise<LocationResponse[]> {
  const res = await fetch(ApiRoutes.Location.BASE, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch locations')
  return res.json() as Promise<LocationResponse[]>
}
