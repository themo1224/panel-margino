import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ChatComposerProps = {
  disabled?: boolean
  onSend: (body: string) => Promise<void>
  className?: string
}

export function ChatComposer({
  disabled,
  onSend,
  className,
}: ChatComposerProps) {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = body.trim()
    if (!trimmed || sending || disabled) return

    setSending(true)
    try {
      await onSend(trimmed)
      setBody('')
    } finally {
      setSending(false)
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className={cn(
        'flex items-end gap-2 rounded-xl border border-border bg-background p-3',
        className
      )}
    >
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        maxLength={5000}
        placeholder="پیام خود را بنویسید…"
        disabled={disabled || sending}
        className="min-h-10 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
      />
      <Button type="submit" disabled={disabled || sending || !body.trim()}>
        {sending ? '…' : 'ارسال'}
      </Button>
    </form>
  )
}
