import { ApiRoutes } from '../../../common/apiRoutes'

export interface LoginResponse {
  message: string
  status: 'SUCCESS' | 'ONBOARDING_REQUIRED'
  role: string | null
}

export async function register(name: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${ApiRoutes.Auth.BASE}${ApiRoutes.Auth.REGISTER}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.errors ? Object.values(err.errors).join(', ') : err.detail ?? 'Registration failed')
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${ApiRoutes.Auth.BASE}${ApiRoutes.Auth.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail ?? 'Login failed')
  }
  return res.json()
}
