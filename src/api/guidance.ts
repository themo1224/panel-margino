import { apiFetch } from './client'

export interface Category {
  id: number
  name: string
  slug: string
  is_active: boolean
  sort_order: number
}

export interface PersonSummary {
  id: number
  name: string
  email: string | null
  phone: string | null
}

export interface GuidanceRequestItem {
  id: number
  topic: string
  contact_name: string
  contact_email: string | null
  contact_phone: string | null
  status: string
  meeting_at?: string | null
  meeting_url?: string | null
  assigned_at?: string | null
  chat_room_id?: number | null
  category?: {
    id: number
    name: string
    slug: string
  }
  student?: PersonSummary
  mentor?: PersonSummary | null
  created_at?: string | null
  updated_at?: string | null
}

export interface CreateGuidanceRequestPayload {
  category_id: number
  topic: string
  contact_name: string
  contact_email?: string | null
  contact_phone?: string | null
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await apiFetch<{ data: Category[] }>('/categories', {
    method: 'GET',
  })
  return response.data
}

export async function fetchMyGuidanceRequests(): Promise<GuidanceRequestItem[]> {
  const response = await apiFetch<{ data: GuidanceRequestItem[] }>(
    '/guidance-requests',
    { method: 'GET' }
  )
  return response.data
}

export async function createGuidanceRequest(
  payload: CreateGuidanceRequestPayload
): Promise<GuidanceRequestItem> {
  return apiFetch<GuidanceRequestItem>('/guidance-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function acceptGuidanceRequest(
  requestId: number,
  meetingAt: string
): Promise<GuidanceRequestItem> {
  return apiFetch<GuidanceRequestItem>(
    `/guidance-requests/${requestId}/accept`,
    {
      method: 'POST',
      body: JSON.stringify({ meeting_at: meetingAt }),
    }
  )
}
