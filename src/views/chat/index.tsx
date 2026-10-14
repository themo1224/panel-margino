import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/EmptyState'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { ChatMessageList } from '@/components/chat/ChatMessageList'
import { ChatRoomList } from '@/components/chat/ChatRoomList'
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp'
import StyleDivider from '@/components/shared/StyleDivider'
import { useAuth } from '@/context/auth-context'
import {
  fetchChatMessages,
  fetchChatRooms,
  sendChatMessage,
  type ChatMessageItem,
  type ChatRoomItem,
} from '@/api/chat'
import { getEcho } from '@/lib/echo'

export default function ChatPage() {
  const { roomId: roomIdParam } = useParams()
  const activeRoomId = roomIdParam ? Number(roomIdParam) : undefined
  const { user } = useAuth()

  const [rooms, setRooms] = useState<ChatRoomItem[]>([])
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const activeRoom = rooms.find((room) => room.id === activeRoomId)

  useEffect(() => {
    let cancelled = false
    async function loadRooms() {
      setLoadingRooms(true)
      setError(null)
      try {
        const data = await fetchChatRooms()
        if (!cancelled) {
          setRooms(data)
        }
      } catch {
        if (!cancelled) {
          setError('بارگذاری گفتگوها ناموفق بود.')
        }
      } finally {
        if (!cancelled) {
          setLoadingRooms(false)
        }
      }
    }
    void loadRooms()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (activeRoomId === undefined || Number.isNaN(activeRoomId)) {
      setMessages([])
      return
    }

    const roomId = activeRoomId
    let cancelled = false
    async function loadMessages() {
      setLoadingMessages(true)
      setError(null)
      try {
        const data = await fetchChatMessages(roomId)
        if (!cancelled) {
          setMessages(data)
        }
      } catch {
        if (!cancelled) {
          setError('بارگذاری پیام‌ها ناموفق بود.')
        }
      } finally {
        if (!cancelled) {
          setLoadingMessages(false)
        }
      }
    }
    void loadMessages()
    return () => {
      cancelled = true
    }
  }, [activeRoomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!activeRoomId || Number.isNaN(activeRoomId)) {
      return
    }

    const echo = getEcho()
    if (!echo) {
      return
    }

    const channelName = `chat.room.${activeRoomId}`
    const channel = echo.private(channelName)
    channel.listen('.message.sent', (payload: ChatMessageItem) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === payload.id)) {
          return prev
        }
        return [...prev, payload]
      })
      setRooms((prev) =>
        prev.map((room) =>
          room.id === activeRoomId
            ? {
                ...room,
                last_message: {
                  id: payload.id,
                  body: payload.body,
                  sender_id: payload.sender.id,
                  created_at: payload.created_at,
                },
              }
            : room
        )
      )
    })

    return () => {
      channel.stopListening('.message.sent')
      echo.leave(channelName)
    }
  }, [activeRoomId])

  async function handleSend(body: string) {
    if (!activeRoomId) return

    const tempId = -Date.now()
    const optimistic: ChatMessageItem = {
      id: tempId,
      chat_room_id: activeRoomId,
      body,
      sender: {
        id: user?.id ?? 0,
        name: user?.name,
      },
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])

    try {
      const saved = await sendChatMessage(activeRoomId, body)
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? saved : m)).filter((m, i, arr) => {
          // Drop duplicate if Echo also delivered the same id
          return arr.findIndex((x) => x.id === m.id) === i
        })
      )
      setRooms((prev) =>
        prev.map((room) =>
          room.id === activeRoomId
            ? {
                ...room,
                last_message: {
                  id: saved.id,
                  body: saved.body,
                  sender_id: saved.sender.id,
                  created_at: saved.created_at,
                },
              }
            : room
        )
      )
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setError('ارسال پیام ناموفق بود.')
      throw new Error('send failed')
    }
  }

  return (
    <div className="flex flex-col p-px bg-border gap-px">
      <BreadcrumbComp title="گفتگو" />
      <StyleDivider />
      <div className="grid gap-px bg-border lg:grid-cols-[280px_1fr] min-h-[70vh]">
        <Card className="flex flex-col overflow-hidden rounded-none border-0 shadow-none py-0">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">گفتگوها</h2>
          </div>
          {loadingRooms ? (
            <p className="p-4 text-sm text-muted-foreground">در حال بارگذاری…</p>
          ) : null}
          {!loadingRooms && rooms.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="هنوز گفتگویی ندارید"
                description="پس از پذیرش درخواست و تعیین زمان جلسه، گفتگو اینجا باز می‌شود."
              />
            </div>
          ) : null}
          {!loadingRooms && rooms.length > 0 ? (
            <ChatRoomList rooms={rooms} activeRoomId={activeRoomId} />
          ) : null}
        </Card>

        <Card className="flex flex-col overflow-hidden rounded-none border-0 shadow-none py-0 min-h-[50vh]">
          {!activeRoomId ? (
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyState
                title="یک گفتگو را انتخاب کنید"
                description="از فهرست سمت راست، گفتگوی مورد نظر را باز کنید."
              />
            </div>
          ) : (
            <>
              <div className="border-b border-border px-4 py-3">
                <h2 className="font-semibold">
                  {activeRoom?.peer?.name ?? 'گفتگو'}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {activeRoom?.topic ?? ''}
                </p>
              </div>

              {error ? (
                <p className="px-4 pt-3 text-sm text-destructive">{error}</p>
              ) : null}

              <div className="flex-1 overflow-y-auto">
                {loadingMessages ? (
                  <p className="p-4 text-sm text-muted-foreground">
                    در حال بارگذاری پیام‌ها…
                  </p>
                ) : null}
                {!loadingMessages && messages.length === 0 ? (
                  <div className="p-4">
                    <EmptyState
                      title="هنوز پیامی نیست"
                      description="اولین پیام را بفرستید تا گفتگو شروع شود."
                    />
                  </div>
                ) : null}
                {!loadingMessages && messages.length > 0 ? (
                  <ChatMessageList
                    messages={messages}
                    currentUserId={user?.id}
                  />
                ) : null}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-border p-3">
                <ChatComposer onSend={handleSend} />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  <Link to="/requests" className="underline-offset-4 hover:underline">
                    بازگشت به درخواست‌ها
                  </Link>
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
