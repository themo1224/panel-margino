import { apiFetch } from './client'

export interface ChatPeer {
  id: number
  name: string
}

export interface ChatLastMessage {
  id: number
  body: string
  sender_id: number
  created_at: string | null
}

export interface ChatRoomItem {
  id: number
  guidance_request_id: number
  topic: string | null
  peer: ChatPeer | null
  category: { id: number; name: string } | null
  last_message: ChatLastMessage | null
  created_at?: string | null
  updated_at?: string | null
}

export interface ChatMessageItem {
  id: number
  chat_room_id: number
  body: string
  sender: {
    id: number
    name?: string | null
  }
  created_at: string | null
  updated_at?: string | null
}

export async function fetchChatRooms(): Promise<ChatRoomItem[]> {
  const response = await apiFetch<{ data: ChatRoomItem[] }>('/chat-rooms', {
    method: 'GET',
  })
  return response.data
}

export async function fetchChatMessages(
  roomId: number,
  options?: { beforeId?: number; limit?: number }
): Promise<ChatMessageItem[]> {
  const params = new URLSearchParams()
  if (options?.beforeId) {
    params.set('before_id', String(options.beforeId))
  }
  if (options?.limit) {
    params.set('limit', String(options.limit))
  }
  const qs = params.toString()
  const path = `/chat-rooms/${roomId}/messages${qs ? `?${qs}` : ''}`
  const response = await apiFetch<{ data: ChatMessageItem[] }>(path, {
    method: 'GET',
  })
  return response.data
}

export async function sendChatMessage(
  roomId: number,
  body: string
): Promise<ChatMessageItem> {
  return apiFetch<ChatMessageItem>(`/chat-rooms/${roomId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  })
}
