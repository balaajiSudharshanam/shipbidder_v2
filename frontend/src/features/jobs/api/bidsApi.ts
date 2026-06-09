import { ApiRoutes } from '../../../common/apiRoutes'
import type { BidResponse } from '../types'

export async function placeBid(jobId: number, amount: number): Promise<BidResponse> {
  const res = await fetch(`${ApiRoutes.Job.BASE}${ApiRoutes.Job.BIDS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ jobId, amount }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? 'Failed to place bid')
  }
  return res.json() as Promise<BidResponse>
}

export async function getMyBids(): Promise<BidResponse[]> {
  const res = await fetch(`${ApiRoutes.Job.BASE}${ApiRoutes.Job.BIDS_MY}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? 'Failed to fetch your bids')
  }
  return res.json() as Promise<BidResponse[]>
}

export async function getMyBidForJob(jobId: number): Promise<BidResponse | null> {
  const res = await fetch(`${ApiRoutes.Job.BASE}${ApiRoutes.Job.BY_ID_MY_BID(jobId)}`, {
    credentials: 'include',
  })
  if (res.status === 204) return null
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? 'Failed to fetch your bid')
  }
  return res.json() as Promise<BidResponse>
}

export async function getJobBids(jobId: number): Promise<BidResponse[]> {
  const res = await fetch(`${ApiRoutes.Job.BASE}${ApiRoutes.Job.BY_ID_BIDS(jobId)}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? 'Failed to fetch bids')
  }
  return res.json() as Promise<BidResponse[]>
}
