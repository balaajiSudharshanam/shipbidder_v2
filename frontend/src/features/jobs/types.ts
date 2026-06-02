import type { LocationResponse } from '../locations/types'

export type CargoType = 'GENERAL' | 'REFRIGERATED' | 'HAZMAT' | 'OVERSIZED'

export interface ShipmentPayload {
  weightKg: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  cargoType: CargoType
  fragile?: boolean
  stackable?: boolean
  specialInstructions?: string
}

export interface CreateJobPayload {
  pickupId: number
  dropoffId: number
  shipment: ShipmentPayload
  budgetCeiling: number
  auctionClosesAt: string
}

export interface ShipmentResponse {
  id: number
  weightKg: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  cargoType: CargoType
  fragile: boolean
  stackable: boolean
  specialInstructions?: string
  imageUrls: string[]
}

export interface JobResponse {
  id: number
  posterEmail: string
  posterName: string
  status: string
  budgetCeiling: number
  auctionClosesAt: string
  pickup: LocationResponse
  dropoff: LocationResponse
  shipment: ShipmentResponse
  createdAt: string
}

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface BidResponse {
  id: number
  jobId: number
  bidderId: number
  bidderName: string
  bidderEmail: string
  amount: number
  status: BidStatus
  createdAt: string
}
