import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import type { ChatRoomItem } from '@/api/chat'

type ChatRoomListProps = {
  rooms: ChatRoomItem[]
  activeRoomId?: number
}

function preview(room: ChatRoomItem): string {
  if (room.last_message?.body) {
    return room.last_message.body
  }
  return 'هنوز پیامی نیست'
}

export function ChatRoomList({ rooms, activeRoomId }: ChatRoomListProps) {
  return (
    <ul className="divide-y divide-border">
      {rooms.map((room) => {
        const active = activeRoomId === room.id
        return (
          <li key={room.id}>
            <Link
              to={`/chat/${room.id}`}
              className={cn(
                'block px-4 py-3 transition-colors hover:bg-muted/60',
                active && 'bg-muted'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium truncate">
                  {room.peer?.name ?? 'طرف گفتگو'}
                </p>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground truncate">
                {room.topic ?? '—'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                {preview(room)}
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
