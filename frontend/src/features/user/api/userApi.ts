export type Role = 'JOB_POSTER' | 'BIDDER'

export async function updateRole(role: Role): Promise<void> {
  const res = await fetch('/api/user/update-role', {
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
