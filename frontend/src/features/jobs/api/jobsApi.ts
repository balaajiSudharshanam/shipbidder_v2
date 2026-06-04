import { ApiRoutes } from '../../../common/apiRoutes'
import type { CreateJobPayload, JobResponse } from '../types'

export async function createJob(payload: CreateJobPayload): Promise<JobResponse> {
  const res = await fetch(ApiRoutes.Job.BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? 'Failed to create job')
  }
  return res.json() as Promise<JobResponse>
}

export async function getOpenJobs(): Promise<JobResponse[]> {
  const res = await fetch(ApiRoutes.Job.BASE, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch jobs')
  return res.json() as Promise<JobResponse[]>
}

export async function getMyJobs(): Promise<JobResponse[]> {
  const res = await fetch(`${ApiRoutes.Job.BASE}${ApiRoutes.Job.MY}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch my jobs')
  return res.json() as Promise<JobResponse[]>
}

export async function getJobById(id: number): Promise<JobResponse> {
  const res = await fetch(`${ApiRoutes.Job.BASE}${ApiRoutes.Job.BY_ID(id)}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch job')
  return res.json() as Promise<JobResponse>
}

export async function uploadJobImages(jobId: number, files: File[]): Promise<JobResponse> {
  const form = new FormData()
  for (const file of files) form.append('images', file)
  const res = await fetch(`${ApiRoutes.Job.BASE}${ApiRoutes.Job.IMAGES(jobId)}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  if (!res.ok) throw new Error('Failed to upload images')
  return res.json() as Promise<JobResponse>
}

export async function awardBid(jobId: number, bidId: number): Promise<void> {
  const res = await fetch(`${ApiRoutes.Job.BASE}${ApiRoutes.Job.BY_ID_AWARD(jobId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ bidId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? 'Failed to award bid')
  }
}
