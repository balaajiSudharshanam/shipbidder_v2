import { ApiRoutes } from '../../../common/apiRoutes'

export type Role = 'JOB_POSTER' | 'BIDDER' | 'UNASSIGNED'

export interface UserProfile {
  id: number
  email: string
  name: string
  role: Role
}

export async function getMe(): Promise<UserProfile> {
  const res = await fetch(`${ApiRoutes.User.BASE}${ApiRoutes.User.ME}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function updateRole(role: Role): Promise<void> {
  const res = await fetch(`${ApiRoutes.User.BASE}${ApiRoutes.User.UPDATE_ROLE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ role }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail ?? 'Failed to update role')
  }
}
