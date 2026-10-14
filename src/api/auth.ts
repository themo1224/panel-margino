import { apiFetch } from './client'

export type UserRole = 'seller' | 'admin'

export interface AuthUser {
  id: number
  name: string
  email: string | null
  phone: string | null
  role: UserRole
}

export interface TokenResponse {
  token: string
  token_type: string
  user: AuthUser
}

export async function login(
  email: string,
  password: string
): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, null)
}

export async function register(payload: {
  name: string
  email: string
  password: string
  password_confirmation: string
}): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, null)
}

export async function requestOtp(phone: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    '/auth/otp/request',
    {
      method: 'POST',
      body: JSON.stringify({ phone }),
    },
    null
  )
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<TokenResponse> {
  return apiFetch<TokenResponse>(
    '/auth/otp/verify',
    {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    },
    null
  )
}

export async function fetchMe(token?: string): Promise<AuthUser> {
  return apiFetch<AuthUser>('/me', { method: 'GET' }, token)
}

export interface UpdateMePayload {
  name?: string
  email?: string | null
  phone?: string | null
}

export async function updateMe(payload: UpdateMePayload): Promise<AuthUser> {
  return apiFetch<AuthUser>('/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function logout(): Promise<void> {
  await apiFetch<void>('/auth/logout', { method: 'POST' })
}
