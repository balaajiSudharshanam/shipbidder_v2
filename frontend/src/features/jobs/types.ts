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
  expectedDeliveryDate?: string
}

export interface BidCondition {
  sharedLoad: boolean | null
  alternateDeliveryDate: string | null
  conditionNote: string | null
}

export interface BidConditionInput {
  sharedLoad?: boolean
  alternateDeliveryDate?: string
  conditionNote?: string
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
  expectedDeliveryDate: string | null
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
  condition: BidCondition | null
}
