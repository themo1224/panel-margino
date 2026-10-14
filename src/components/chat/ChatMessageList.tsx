import { cn } from '@/lib/utils'
import type { ChatMessageItem } from '@/api/chat'

type ChatMessageListProps = {
  messages: ChatMessageItem[]
  currentUserId?: number
}

function formatTime(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

export function ChatMessageList({
  messages,
  currentUserId,
}: ChatMessageListProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      {messages.map((message) => {
        const mine = currentUserId !== undefined && message.sender.id === currentUserId
        return (
          <div
            key={message.id}
            className={cn('flex', mine ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                mine
                  ? 'bg-primary text-primary-foreground rounded-bl-md'
                  : 'bg-muted text-foreground rounded-br-md'
              )}
            >
              {!mine && message.sender.name ? (
                <p className="mb-1 text-xs opacity-80">{message.sender.name}</p>
              ) : null}
              <p className="whitespace-pre-wrap break-words">{message.body}</p>
              <p
                className={cn(
                  'mt-1 text-[10px]',
                  mine ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}
              >
                {formatTime(message.created_at)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
