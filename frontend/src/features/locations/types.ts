export interface LocationResponse {
  id: number
  lat: number
  lng: number
  address?: string
}

export interface SaveLocationPayload {
  lat: number
  lng: number
  address?: string
}
