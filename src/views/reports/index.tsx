import useSWR from 'swr'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { REPORTS_KEY, fetchReports } from '@/api/pricing/pricing-api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ReportsPage() {
  const { data, isLoading, error } = useSWR(REPORTS_KEY, fetchReports)
  const report = data?.data

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-1">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <p className="p-4 text-sm text-destructive">بارگذاری گزارش ناموفق بود.</p>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-1 pb-8">
      <div>
        <h1 className="text-2xl font-semibold">گزارش‌ها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          خلاصه {report.monthLabel} — پیشنهادها، بررسی رقبا و اقدام روی قیمت.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Metric
          title="پیشنهاد صادر شده"
          value={report.recommendationsIssued.toLocaleString('fa-IR')}
        />
        <Metric
          title="بررسی رقیب"
          value={report.rivalChecks.toLocaleString('fa-IR')}
        />
        <Metric
          title="اقدام روی قیمت"
          value={report.priceActions.toLocaleString('fa-IR')}
        />
        <Metric
          title="میانگین فاصله از رقیب"
          value={`${report.avgVsRivalPct.toLocaleString('fa-IR')}٪`}
        />
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">روند هفتگی</CardTitle>
          <CardDescription>
            پیشنهادهای امن در برابر تعداد بررسی‌های قیمت رقیب در هر هفته.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report.chart}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="recommends"
                name="پیشنهاد امن"
                fill="var(--primary)"
                radius={4}
              />
              <Bar
                dataKey="rivalHits"
                name="بررسی رقیب"
                fill="var(--accent)"
                radius={4}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Card className="shadow-none">
      <CardContent className="pt-5">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold mt-1 tabular-nums">{value}</p>
      </CardContent>
    </Card>
  )
}
