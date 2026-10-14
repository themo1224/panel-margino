import { FormEvent, useState } from 'react'
import useSWR from 'swr'
import {
  API_KEYS_KEY,
  createApiKey,
  fetchApiKeys,
  revokeApiKey,
} from '@/api/pricing/pricing-api'
import type { ApiKeyItem } from '@/types/apps/pricing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function ApiKeysPage() {
  const { data, isLoading, error, mutate } = useSWR(API_KEYS_KEY, fetchApiKeys)
  const keys = data?.data ?? []
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [newSecret, setNewSecret] = useState<string | null>(null)

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setCreating(true)
    setNewSecret(null)
    try {
      const res = await createApiKey(name)
      setNewSecret(res.secret ?? null)
      setName('')
      await mutate()
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(id: string) {
    await revokeApiKey(id)
    await mutate()
  }

  return (
    <div className="flex flex-col gap-6 p-1 pb-8">
      <div>
        <h1 className="text-2xl font-semibold">کلید API</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          برای اتصال افزونه ووکامرس: کلید را در صفحهٔ «اتصال» بچسبانید. آدرس
          سرویس محلی:{' '}
          <span className="font-mono" dir="ltr">
            http://localhost:8000/v1
          </span>
        </p>
      </div>

      <Card className="shadow-none max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">ایجاد کلید</CardTitle>
          <CardDescription>
            کلید کامل فقط یک‌بار پس از ایجاد نمایش داده می‌شود.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => void handleCreate(e)}
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="key-name">نام کلید</Label>
              <Input
                id="key-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً ووکامرس اصلی"
              />
            </div>
            <Button type="submit" className="sm:self-end" disabled={creating}>
              {creating ? '…' : 'ایجاد'}
            </Button>
          </form>
          {newSecret ? (
            <p
              className="mt-3 text-sm rounded-md border border-accent/40 bg-[var(--accent-soft)]/50 px-3 py-2 break-all"
              dir="ltr"
            >
              کلید یک‌بار نمایش: {newSecret}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : error ? (
        <p className="text-sm text-destructive">بارگذاری کلیدها ناموفق بود.</p>
      ) : (
        <Card className="shadow-none overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">نام</TableHead>
                  <TableHead className="text-start">پیشوند</TableHead>
                  <TableHead className="text-start">ایجاد</TableHead>
                  <TableHead className="text-start">آخرین استفاده</TableHead>
                  <TableHead className="text-start">وضعیت</TableHead>
                  <TableHead className="text-start">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key: ApiKeyItem) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium text-sm">
                      {key.name}
                    </TableCell>
                    <TableCell className="text-sm" dir="ltr">
                      {key.prefix}…
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {key.createdAt
                        ? new Date(key.createdAt).toLocaleDateString('fa-IR')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {key.lastUsedAt
                        ? new Date(key.lastUsedAt).toLocaleDateString('fa-IR')
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {key.revoked ? (
                        <Badge variant="outline">باطل‌شده</Badge>
                      ) : (
                        <Badge className="bg-primary/10 text-primary border-0">
                          فعال
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={key.revoked}
                        onClick={() => void handleRevoke(key.id)}
                      >
                        ابطال
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
